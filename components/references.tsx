"use client"

import { useTranslation } from "./language-provider"
import { AnimatePresence, motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { client } from "@/lib/sanity"


function References() {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  type Testimonial = {
    _id: string
    name: string
    position?: string
    testimonial: string
  }

  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const result = await client.fetch(`*[_type == "review"] | order(_createdAt desc){
          _id,
          name,
          position,
          testimonial
        }`)
        setTestimonials(result)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Navigation functions
  const nextTestimonial = () => {
    if (isAnimating) return
    setDirection(1)
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    if (isAnimating) return
    setDirection(-1)
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }


  return (
    <section id="references" className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Abstract shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-20 w-[300px] h-[300px] border border-white/20 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-20 left-20 w-[200px] h-[200px] border border-white/20 rounded-full"
        />

        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-dot-white/[0.2]"></div>
        </div>

        {/* Quote symbols */}
        <svg
          className="absolute top-10 left-10 w-20 h-20 text-emerald-500 opacity-[0.07]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30,30 Q30,50 50,50 Q70,50 70,30 Q70,10 50,10 Q30,10 30,30 Z"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path d="M20,40 L40,40" stroke="currentColor" strokeWidth="4" />
          <path d="M60,40 L80,40" stroke="currentColor" strokeWidth="4" />
        </svg>

        <svg
          className="absolute bottom-10 right-10 w-20 h-20 text-sage-500 opacity-[0.07]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30,30 Q30,50 50,50 Q70,50 70,30 Q70,10 50,10 Q30,10 30,30 Z"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path d="M20,40 L40,40" stroke="currentColor" strokeWidth="4" />
          <path d="M60,40 L80,40" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("references.title")}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-zinc-400">
            {t("references.description")}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto relative"
        >
          {/* Testimonial + controls wrapper */}
          <div className="flex flex-col items-stretch gap-1 relative">
            {/* Testimonial card */}
            <div className="relative overflow-visible transition-all duration-300">
              {loading ? (
                <p className="text-white text-center">Načítavam referencie...</p>
              ) : testimonials.length > 0 ? (
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={testimonials[currentIndex]?._id ?? "no-id"}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    onAnimationComplete={() => setIsAnimating(false)}
                    className="bg-zinc-800 p-8 rounded-lg w-full"
                  >
                    <Quote className="h-8 w-8 text-emerald-500 mb-4" />
                    <p className="text-zinc-300 mb-6 sm:text-lg text-sm">
                      {testimonials[currentIndex]?.testimonial}
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                        {testimonials[currentIndex]?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{testimonials[currentIndex]?.name}</h4>
                        <p className="text-zinc-400 text-sm">{testimonials[currentIndex]?.position}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <p className="text-white text-center">Žiadne referencie na zobrazenie.</p>
              )}
            </div>

            {/* Controls */}
            {testimonials.length > 0 && (
              <div className="flex justify-between pt-1">
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (isAnimating) return
                        setDirection(index > currentIndex ? 1 : -1)
                        setIsAnimating(true)
                        setCurrentIndex(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                          ? "bg-emerald-500 w-6"
                          : "bg-zinc-600 hover:bg-zinc-500"
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                    disabled={isAnimating}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous testimonial</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                    disabled={isAnimating}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next testimonial</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
} export default References
