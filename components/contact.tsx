"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:gap-16"
        >
          {/* Section Title */}
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <h2 className="text-xs tracking-widest text-muted-foreground uppercase lg:sticky lg:top-24">
              Contact
            </h2>
          </div>
          
          {/* Contact Content */}
          <div className="lg:w-2/3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-foreground leading-relaxed mb-6"
            >
              {"If you'd like to discuss a project or just say hi, I'm always down to chat."}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                asChild
              >
                <a href="mailto:alex@example.com">Contact</a>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Mail</span>
                <a
                  href="mailto:alex@example.com"
                  className="text-sm text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  alex@example.com
                  <Mail className="w-4 h-4" />
                </a>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">LinkedIn</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  @alexchen
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">GitHub</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  @alexchen
                  <Github className="w-4 h-4" />
                </a>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">X</span>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2"
                >
                  @alexchen_data
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
