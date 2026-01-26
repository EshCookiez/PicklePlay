<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #000;
            margin: 0;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #000;
            color: #fff !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
        .link {
            word-break: break-all;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏓 PicklePlay</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $userName }}!</h2>
            
            <p>Thank you for registering with PicklePlay! We're excited to have you join our community.</p>
            
            <p>Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p class="link">{{ $verificationUrl }}</p>
            
            <p><strong>This link will expire in 60 minutes.</strong></p>
            
            <p>If you didn't create an account with PicklePlay, please ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} PicklePlay. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
