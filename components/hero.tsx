"use client"

import { motion } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticleField } from "./particle-field"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-center lg:gap-16"
        >
          {/* Left Column - Name and Navigation */}
          <div className="lg:w-1/3 mb-12 lg:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Alex Chen
            </motion.h1>
            <motion.p 
              className="text-primary font-medium text-lg mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Data Scientist
            </motion.p>
            <motion.p 
              className="text-muted-foreground text-sm leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              I transform complex datasets into<br />
              actionable insights through machine<br />
              learning and statistical analysis.
            </motion.p>
            
            {/* Navigation */}
            <motion.nav 
              className="space-y-3 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { label: "ABOUT", href: "#about" },
                { label: "EXPERIENCE", href: "#experience" },
                { label: "PROJECTS", href: "#projects" },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                >
                  <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-foreground transition-all duration-300" />
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
            
            {/* Social Links */}
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:alex@example.com"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
          
          {/* Right Column - Bio Content */}
          <motion.div 
            className="lg:w-2/3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              {"I'm a data scientist passionate about uncovering patterns in complex datasets and building predictive models that drive business decisions. My work sits at the intersection of "}
              <span className="text-foreground font-medium">statistics</span>
              {", "}
              <span className="text-foreground font-medium">machine learning</span>
              {", and "}
              <span className="text-foreground font-medium">domain expertise</span>
              {", creating solutions that are both technically rigorous and practically impactful."}
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              {"Currently, I'm focused on developing ML pipelines for "}
              <span className="text-foreground font-medium">time series forecasting</span>
              {" and "}
              <span className="text-foreground font-medium">natural language processing</span>
              {". I've worked on projects ranging from customer churn prediction to sentiment analysis of financial news."}
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              {"When I'm not diving into data, I contribute to open-source projects, write about emerging ML techniques, and explore new frameworks in the rapidly evolving AI landscape."}
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="default" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                asChild
              >
                <a href="#projects">View Projects</a>
              </Button>
              <Button 
                variant="outline" 
                className="border-border hover:border-primary hover:text-primary transition-all duration-300"
                asChild
              >
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
