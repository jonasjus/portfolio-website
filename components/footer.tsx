"use client"

import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear}. Crafted by Jonas Justesen
          </p>
          
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
