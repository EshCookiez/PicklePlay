-- =====================================================
-- PICKLEPLAY - COMMUNITY FEATURES
-- =====================================================
-- This file creates all tables related to community, groups, and teams
-- Run this in Supabase SQL Editor AFTER 06_rankings_points_system.sql

-- =====================================================
-- GROUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.groups (
    id BIGSERIAL PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Type & Category
    group_type VARCHAR(20) DEFAULT 'public'
        CHECK (group_type IN ('public', 'private', 'invite_only')),
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('recreational', 'competitive', 'social', 'training', 'regional', 'age_based', 'skill_based', 'other')),
    
    -- Location
    is_location_based BOOLEAN DEFAULT FALSE,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    
    -- Membership
    max_members INTEGER,
    current_member_count INTEGER DEFAULT 1,
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Settings
    allow_member_posts BOOLEAN DEFAULT TRUE,
    allow_member_invites BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Media
    cover_photo TEXT,
    group_photo TEXT,
    
    -- Rules
    rules TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'archived')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_groups_creator ON public.groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_type ON public.groups(group_type);
CREATE INDEX IF NOT EXISTS idx_groups_category ON public.groups(category);
CREATE INDEX IF NOT EXISTS idx_groups_city ON public.groups(city);
CREATE INDEX IF NOT EXISTS idx_groups_status ON public.groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_is_featured ON public.groups(is_featured);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_groups_search ON public.groups USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Add RLS policies
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public groups"
    ON public.groups FOR SELECT
    USING (group_type = 'public' AND status = 'active');

CREATE POLICY "Members can view their groups"
    ON public.groups FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.status = 'active'
        )
    );

CREATE POLICY "Users can create groups"
    ON public.groups FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Group owners can update their groups"
    ON public.groups FOR UPDATE
    USING (
        auth.uid() = creator_id
        OR EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.role IN ('owner', 'admin')
        )
    );

-- =====================================================
-- GROUP MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Membership
    role VARCHAR(20) DEFAULT 'member'
        CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('pending', 'active', 'banned')),
    
    -- Dates
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Settings
    notifications_enabled BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(group_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON public.group_members(role);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON public.group_members(status);

-- Add RLS policies
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view members list"
    ON public.group_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE groups.id = group_members.group_id
            AND (
                groups.group_type = 'public'
                OR EXISTS (
                    SELECT 1 FROM public.group_members gm
                    WHERE gm.group_id = groups.id
                    AND gm.user_id = auth.uid()
                    AND gm.status = 'active'
                )
            )
        )
    );

CREATE POLICY "Users can join groups"
    ON public.group_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.teams (
    id BIGSERIAL PRIMARY KEY,
    captain_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    
    -- Team Type
    team_type VARCHAR(20) DEFAULT 'doubles'
        CHECK (team_type IN ('singles', 'doubles', 'mixed', 'league')),
    skill_level VARCHAR(30)
        CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    
    -- Location
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    
    -- Membership
    max_members INTEGER DEFAULT 10,
    current_member_count INTEGER DEFAULT 1,
    is_recruiting BOOLEAN DEFAULT TRUE,
    
    -- Media
    logo TEXT,
    cover_photo TEXT,
    team_photos JSONB,
    
    -- Colors
    primary_color VARCHAR(7), -- Hex color
    secondary_color VARCHAR(7),
    
    -- Statistics
    tournaments_entered INTEGER DEFAULT 0,
    tournaments_won INTEGER DEFAULT 0,
    total_matches_played INTEGER DEFAULT 0,
    total_matches_won INTEGER DEFAULT 0,
    team_ranking INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'disbanded')),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_teams_captain ON public.teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON public.teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_type ON public.teams(team_type);
CREATE INDEX IF NOT EXISTS idx_teams_city ON public.teams(city);
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_is_recruiting ON public.teams(is_recruiting);
CREATE INDEX IF NOT EXISTS idx_teams_ranking ON public.teams(team_ranking);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_teams_search ON public.teams USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(tagline, ''))
);

-- Add RLS policies
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active teams"
    ON public.teams FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can create teams"
    ON public.teams FOR INSERT
    WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Team captains can update their teams"
    ON public.teams FOR UPDATE
    USING (
        auth.uid() = captain_id
        OR EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('captain', 'co_captain')
        )
    );

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.team_members (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Membership
    role VARCHAR(20) DEFAULT 'player'
        CHECK (role IN ('captain', 'co_captain', 'player', 'substitute')),
    jersey_number INTEGER,
    position VARCHAR(100),
    
    -- Dates
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'removed')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(team_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON public.team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON public.team_members(status);

-- Add RLS policies
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
    ON public.team_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE teams.id = team_members.team_id
            AND teams.status = 'active'
        )
    );

CREATE POLICY "Team captains can manage team members"
    ON public.team_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.teams
            WHERE teams.id = team_members.team_id
            AND (
                teams.captain_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.team_members tm
                    WHERE tm.team_id = teams.id
                    AND tm.user_id = auth.uid()
                    AND tm.role = 'co_captain'
                )
            )
        )
    );

-- =====================================================
-- COMMUNITY POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Post Context (Polymorphic)
    postable_type VARCHAR(100), -- Group, Team, null for general posts
    postable_id BIGINT,
    
    -- Content
    content TEXT NOT NULL,
    post_type VARCHAR(30) DEFAULT 'text'
        CHECK (post_type IN ('text', 'image', 'video', 'poll', 'achievement', 'match_result')),
    
    -- Media
    media JSONB, -- Array of media objects
    
    -- Poll (if applicable)
    poll_options JSONB,
    poll_ends_at TIMESTAMPTZ,
    allow_multiple_votes BOOLEAN DEFAULT FALSE,
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Visibility
    visibility VARCHAR(20) DEFAULT 'public'
        CHECK (visibility IN ('public', 'group', 'team', 'friends')),
    is_pinned BOOLEAN DEFAULT FALSE,
    
    -- Moderation
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'published'
        CHECK (status IN ('published', 'hidden', 'deleted', 'flagged')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_postable ON public.community_posts(postable_type, postable_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON public.community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON public.community_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON public.community_posts(is_pinned);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_community_posts_search ON public.community_posts USING gin(
    to_tsvector('english', coalesce(content, ''))
);

-- Add RLS policies
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public posts"
    ON public.community_posts FOR SELECT
    USING (visibility = 'public' AND status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Users can view posts in their groups/teams"
    ON public.community_posts FOR SELECT
    USING (
        (visibility = 'group' AND postable_type = 'Group' AND
            EXISTS (
                SELECT 1 FROM public.group_members
                WHERE group_members.group_id = community_posts.postable_id
                AND group_members.user_id = auth.uid()
                AND group_members.status = 'active'
            )
        )
        OR
        (visibility = 'team' AND postable_type = 'Team' AND
            EXISTS (
                SELECT 1 FROM public.team_members
                WHERE team_members.team_id = community_posts.postable_id
                AND team_members.user_id = auth.uid()
                AND team_members.status = 'active'
            )
        )
    );

CREATE POLICY "Users can create posts"
    ON public.community_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
    ON public.community_posts FOR UPDATE
    USING (auth.uid() = author_id);

-- =====================================================
-- POST COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES public.post_comments(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'published'
        CHECK (status IN ('published', 'hidden', 'deleted')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON public.post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON public.post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_status ON public.post_comments(status);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON public.post_comments(created_at);

-- Add RLS policies
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on visible posts"
    ON public.post_comments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.community_posts
            WHERE community_posts.id = post_comments.post_id
            AND community_posts.status = 'published'
            AND community_posts.deleted_at IS NULL
        )
    );

CREATE POLICY "Users can create comments"
    ON public.post_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON public.post_comments FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- POST LIKES TABLE (Polymorphic)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
    id BIGSERIAL PRIMARY KEY,
    likeable_type VARCHAR(100) NOT NULL, -- Post, Comment
    likeable_id BIGINT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(likeable_type, likeable_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_post_likes_likeable ON public.post_likes(likeable_type, likeable_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);

-- Add RLS policies
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes"
    ON public.post_likes FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_members_updated_at BEFORE UPDATE ON public.group_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.groups
        SET current_member_count = current_member_count + 1
        WHERE id = NEW.group_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.groups
        SET current_member_count = GREATEST(current_member_count - 1, 1)
        WHERE id = OLD.group_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        UPDATE public.groups
        SET current_member_count = (
            SELECT COUNT(*)
            FROM public.group_members
            WHERE group_id = NEW.group_id
            AND status = 'active'
        )
        WHERE id = NEW.group_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_group_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.group_members
    FOR EACH ROW
    EXECUTE FUNCTION update_group_member_count();

-- Function to update team member count
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.teams
        SET current_member_count = current_member_count + 1
        WHERE id = NEW.team_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.teams
        SET current_member_count = GREATEST(current_member_count - 1, 1)
        WHERE id = OLD.team_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        UPDATE public.teams
        SET current_member_count = (
            SELECT COUNT(*)
            FROM public.team_members
            WHERE team_id = NEW.team_id
            AND status = 'active'
        )
        WHERE id = NEW.team_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_team_member_count();

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.community_posts
        SET comment_count = comment_count + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.community_posts
        SET comment_count = GREATEST(comment_count - 1, 0)
        WHERE id = OLD.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comment_count_trigger
    AFTER INSERT OR DELETE ON public.post_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.likeable_type = 'Post' THEN
            UPDATE public.community_posts
            SET like_count = like_count + 1
            WHERE id = NEW.likeable_id;
        ELSIF NEW.likeable_type = 'Comment' THEN
            UPDATE public.post_comments
            SET like_count = like_count + 1
            WHERE id = NEW.likeable_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.likeable_type = 'Post' THEN
            UPDATE public.community_posts
            SET like_count = GREATEST(like_count - 1, 0)
            WHERE id = OLD.likeable_id;
        ELSIF OLD.likeable_type = 'Comment' THEN
            UPDATE public.post_comments
            SET like_count = GREATEST(like_count - 1, 0)
            WHERE id = OLD.likeable_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_like_count_trigger
    AFTER INSERT OR DELETE ON public.post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_like_count();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.groups IS 'User groups for community organization';
COMMENT ON TABLE public.group_members IS 'Members of groups';
COMMENT ON TABLE public.teams IS 'Pickleball teams';
COMMENT ON TABLE public.team_members IS 'Members of teams';
COMMENT ON TABLE public.community_posts IS 'Community posts and updates';
COMMENT ON TABLE public.post_comments IS 'Comments on community posts';
COMMENT ON TABLE public.post_likes IS 'Likes on posts and comments';
