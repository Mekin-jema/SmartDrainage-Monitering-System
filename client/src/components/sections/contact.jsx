import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GithubIcon from "../icons/github-icon";
import LinkedInIcon from "../icons/linkedin-icon";

// Define schema
const formSchema = z.object({
  firstName: z.string().min(2, "First name too short").max(255),
  lastName: z.string().min(2, "Last name too short").max(255),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message cannot be empty"),
});

export const ContactSection = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values) => {
    // Optional: implement API call or mailto
    console.log("Submitted:", values);
  };

  return (
    <section id="contact" className="container py-24 sm:py-32 md:max-w-[80%] mx-auto p-3 text-lg">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg text-primary mb-2 tracking-wider text-center">Contact</h2>
            <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
          </div>
          <p className="mb-8 text-muted-foreground lg:w-5/6">
            If you have questions, feedback, or would like to learn more about this project, feel free to reach out. We're happy to share insights and collaborate.
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <div className="flex gap-2 mb-1">
                <Phone />
                <div className="font-bold">Phone</div>
              </div>
              <div>+251 92 006 4543</div>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <Mail />
                <div className="font-bold">Email</div>
              </div>
              <div>mekinjemal999@gmail.com</div>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <GithubIcon />
                <div className="font-bold">GitHub</div>
              </div>
              <a href="https://github.com/mekinjemal" className="text-primary hover:underline" target="_blank">
                github.com/mekinjemal
              </a>
            </div>

            <div>
              <div className="flex gap-2 mb-1">
                <LinkedInIcon />
                <div className="font-bold">LinkedIn</div>
              </div>
              <a href="https://linkedin.com/in/mekinjemal" className="text-primary hover:underline" target="_blank">
                linkedin.com/in/mekinjemal
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="bg-muted/60 dark:bg-card">
          <CardHeader className="text-primary text-2xl">Send a Message</CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full gap-4">
                <div className="flex flex-col md:flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Abebe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bekele" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Your message or inquiry..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4">Send Message</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter />
        </Card>
      </section>
    </section>

  );
};
