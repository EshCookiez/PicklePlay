"use client";

import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import AnimatedContent from "../animate/AnimatedContent";
import { useState } from "react";

const contactMethods = [
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="py-20 md:py-20 bg-gradient-to-b from-blue-50 to-white" id="contact">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <AnimatedContent
            distance={50}
            direction="vertical"
            duration={0.6}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0a56a7]">Get In Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </AnimatedContent>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, idx) => {
            const IconComponent = method.icon;
            return (
              <AnimatedContent
                key={idx}
                distance={100}
                direction="vertical"
                duration={0.8}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                threshold={0.1}
                delay={idx * 0.15}
              >
                <div className="group bg-white rounded-xl border  border-gray-200 p-8 shadow-md hover:shadow-2xl transition-all duration-300 text-center h-full">
                  <div className="flex justify-center mb-6">
                    <div className={`p-4  bg-gradient-to-br from-[#a3ff01] to-blue-600  text-white  rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{method.title}</h3>
                  <p className="text-gray-600 group-hover:text-[#0a56a7] transition-colors duration-200 font-semibold">{method.details}</p>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
          >
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-[#0a56a7]">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 transition"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0a56a7] focus:outline-none focus:ring-2 focus:ring-[#0a56a7]/20 transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#0a56a7] to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>
          </AnimatedContent>

          {/* Info Box */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            duration={0.8}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            threshold={0.2}
            delay={0.2}
          >
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-[#0a56a7] to-blue-600 rounded-xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Quick Response</h3>
                <p className="text-blue-100 mb-6">
                  We typically respond to inquiries within 24 hours during business days. For urgent matters, feel free to call us directly.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-[#0a56a7]">Follow Us</h3>
                <p className="text-gray-600 mb-6">
                  Stay updated with the latest pickleball events and news from PicklePlay.
                </p>
                <a
                  href="https://www.facebook.com/pickleplayofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <Facebook className="w-5 h-5" />
                  Follow on Facebook
                </a>
              </div>

              <div className="bg-[#a3ff01] rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-3 text-[#0a56a7]">Office Hours</h3>
                <ul className="space-y-2 text-gray-900 font-medium">
                  <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday: 10:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
