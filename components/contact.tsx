"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Send,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/app/actions/send-email";
import type { ContactFormData } from "@/app/actions/send-email";

export default function Contact() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const result = await sendEmail(formState);

      setFormStatus({
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });

        // Reset form on successful submission
        setFormState({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Error sending message",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
      toast({
        title: "Error sending message",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      text: "1raj.aayush@gmail.com",
      href: "mailto:1raj.aayush@gmail.com",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      text: "+91 8434288049",
      href: "tel:+918434288049",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      text: "Patna ,Bihar -800020",
      href: "",
    },
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/ayuxsh009",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/ayush-raj009/",
      label: "LinkedIn",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 w-full bg-background/50 backdrop-blur-sm"
      ref={containerRef}
    >
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">
            Contact Me
          </h2>
          <p className="text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities?
            Feel free to reach out to me using the form below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50 bg-background/80 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-white">
                  Contact Information
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-slate-300">
                  Feel free to reach out through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 text-foreground dark:text-slate-200 hover:text-primary transition-colors group"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        {item.icon}
                      </div>
                      <span>{item.text}</span>
                    </motion.a>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4 text-foreground dark:text-white">
                    Connect with me
                  </h4>
                  <div className="flex gap-4">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                        whileHover={{ y: -5 }}
                        aria-label={link.label}
                      >
                        {link.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="relative h-60 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 dark:to-slate-900/80 z-10"></div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.7477770362154!2d85.12400207544491!3d25.615379416196464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f2a91d65e27469%3A0x7f9123ce59e5a9be!2sPatna%2C%20Bihar%20800020!5e0!3m2!1sen!2sin!4v1712998741495!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
                    className="z-0"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50 bg-background/80 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-white">
                  Send Me a Message
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-slate-300">
                  Fill out the form below and I'll get back to you as soon as
                  possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formStatus && (
                    <div
                      className={`p-4 mb-4 rounded-md flex items-center gap-3 ${
                        formStatus.success
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      }`}
                    >
                      {formStatus.success ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span>{formStatus.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground dark:text-white"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background dark:bg-slate-900/80 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground dark:text-white"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background dark:bg-slate-900/80 border-border dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground dark:text-white"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject of your message"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background dark:bg-slate-900/80 border-border dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground dark:text-white"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="min-h-[150px] resize-none transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background dark:bg-slate-900/80 border-border dark:border-slate-700"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gap-2 relative overflow-hidden group bg-primary hover:bg-primary/90 text-white"
                    disabled={isSubmitting}
                  >
                    <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full"></span>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
