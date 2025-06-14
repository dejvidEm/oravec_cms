"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

import { useTranslation } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Home, CheckCircle, X, Building, Crown, FileCheck, Clock, Shield, Book, Layers2, ArrowBigRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { client } from "@/lib/sanity"
import { Icon } from "@radix-ui/react-select"
import { PortableText } from "next-sanity"

type CardData = {
  _id: string
  title: string
  price: string
  features: string[]
  icon: string
  imageUrl: string
}

type ServicesSectionData = {
  title: string
  description: string
  mainService: {
    heading: string
    subheading: string
    text: any
    image: {
      asset: {
        _id: string
        url: string
      }
      alt?: string
    }
    features: {
      title: string
      description: string
    }[]
  }
  levelsTitle: string
  collaborationLevels: {
    title: string
    quote: string
    description: any // PortableText blocks
    label: string
  }[]
}

export function Services() {
  const [services, setServices] = useState<CardData[]>([])
  const [data, setData] = useState<ServicesSectionData | null>(null)
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    client.fetch(
      `*[_type == "serviceCard"] | order(_createdAt asc){
    _id,
    title,
    price,
    features,
    icon,
    "imageUrl": image.asset->url
  }`
    ).then(setServices)
  }, [])

  useEffect(() => {
    const query = `
      *[_type == "servicesSection"][0]{
        title,
        description,
        mainService{
          heading,
          subheading,
          text,
          image{
            asset->{
              _id,
              url
            },
            alt
          },
          features[]{
            title,
            description
          }
        },
        levelsTitle,
        collaborationLevels[]{
          title,
          quote,
          description,
          label
        }
      }
    `
    client.fetch(query).then(setData)
  }, [])


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
    <section id="services" className="py-24 bg-zinc-50 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle patterns */}
        <div className="absolute right-0 top-0 h-64 w-64 bg-emerald-200 rounded-full opacity-[0.07] blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute left-0 bottom-0 h-64 w-64 bg-sage-200 rounded-full opacity-[0.07] blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        {/* Architectural elements */}
        <svg
          className="absolute top-1/4 left-0 h-40 w-40 text-sage-500 opacity-[0.03]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="10" width="80" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
          <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="2" />
          <rect x="40" y="40" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        </svg>

        <svg
          className="absolute bottom-1/4 right-0 h-40 w-40 text-emerald-500 opacity-[0.03]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
        </svg>

        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-dot-black/[0.2]"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            {data?.title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-zinc-600">
            {data?.description}
          </motion.p>
        </motion.div>

        {/* Main Service Description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[300px]">
              {data?.mainService.image?.asset?.url && (
                <Image
                  src={data.mainService.image.asset.url}
                  alt={data.mainService.image.alt || data.mainService.heading}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex items-end">
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{data?.mainService.heading}</h3>
                  <p className="text-xl text-zinc-200">{data?.mainService.subheading}</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <PortableText
                value={data?.mainService.text}
                components={{
                  block: {
                    normal: ({ children }) => <p className="text-zinc-700 mb-6">{children}</p>,
                  },
                }}
              />
              <div className="grid md:grid-cols-3 gap-6">
                {data?.mainService.features.map((feature, index) => (
                  <div className="flex items-start" key={index}>
                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                      {/* Voliteľne: môžeš meniť ikonu podľa indexu */}
                      <FileCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-900">{feature.title}</h4>
                      <p className="text-sm text-zinc-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Packages */}
        {data?.levelsTitle && (
          <motion.h3 variants={itemVariants} className="text-2xl font-bold text-center flex flex-col gap-4 mb-8">
            <div className="mb-8 text-gray-700">{data.levelsTitle}</div>

            {data.collaborationLevels.map((level, index) => (
              <div
                key={index}
                className="w-full mx-auto p-6 space-y-6 rounded-2xl shadow-2xl border border-zinc-200"
              >
                <h2 className="text-xl font-bold text-gray-800">{level.title}</h2>
                <p className="italic text-emerald-500">„{level.quote}“</p>
                <PortableText
                  value={level.description}
                  components={{
                    block: {
                      h1: ({ children }) => <h1 className="text-gray-700 text-2xl font-bold">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-gray-700 text-xl font-semibold">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-gray-700 font-medium">{children}</h3>,
                      normal: ({ children }) => <p className="text-gray-700 text-xl">{children}</p>,
                    },
                  }}
                />
                <div className="max-w-64 mx-auto">
                  <p className="border-2 border-emerald-600 rounded-xl font-semibold text-green-600 text-center">
                    {level.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.h3>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center items-center"
        >
          {services.map((service) => {

            return (
              <motion.div
                key={service._id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-zinc-200 hover:border-emerald-300 transition-colors duration-300 flex flex-col h-full"
              >
                <div className="relative h-[200px]">
                  {service.imageUrl && (
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-emerald-800/40 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                        <Layers2 className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-zinc-900">{service.price}</div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {service.features?.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-zinc-700">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href={`/contact?package=${encodeURIComponent(service.title)}`}>
                      <ArrowRight className="h-7 w-7 text-white" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
