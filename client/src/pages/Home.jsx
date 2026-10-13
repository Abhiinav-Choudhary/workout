import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  ShoppingBag,
  Star,
  MoveUpRight,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&auto=format&fit=crop&q=85",
    eyebrow: "GEAR UP. SHOW UP.",
    title: "Transform Your Body.",
    description:
      "Premium workout and calisthenics equipment built for your next level.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&auto=format&fit=crop&q=85",
    eyebrow: "BUILT FOR THE GRIND",
    title: "Train Like a Champion.",
    description:
      "Get the gear you need to train harder, move better, and grow stronger.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1800&auto=format&fit=crop&q=85",
    eyebrow: "STRENGTH STARTS HERE",
    title: "Own Every Rep.",
    description:
      "From your first pull-up to advanced skills, build your journey your way.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1800&auto=format&fit=crop&q=85",
    eyebrow: "YOUR SPACE. YOUR RULES.",
    title: "Make Every Workout Count.",
    description:
      "Versatile equipment for training at home, in the gym, or outdoors.",
  },
];

const categories = [
  {
    name: "Pull-up Bars",
    subtitle: "Build upper-body strength",
    description:
      "Take your pull-ups, chin-ups, and hanging exercises to the next level with dependable training essentials.",
    icon: Dumbbell,
    number: "01",
  },
  {
    name: "Parallettes",
    subtitle: "Control every movement",
    description:
      "Train push-ups, dips, L-sits, and balance skills with equipment made for bodyweight mastery.",
    icon: ShieldCheck,
    number: "02",
  },
  {
    name: "Resistance Bands",
    subtitle: "Train beyond your limits",
    description:
      "Add assistance, resistance, and versatility to your warm-ups, strength sessions, and skill work.",
    icon: Award,
    number: "03",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <main className="overflow-hidden bg-white text-gray-950">
      {/* HERO CAROUSEL */}
      <section
        aria-label="Featured fitness equipment"
        className="relative h-[520px] overflow-hidden bg-[#101010] sm:h-[600px] lg:h-[680px]"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt=""
              fetchPriority={index === 0 ? "high" : "auto"}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ${
                index === currentSlide ? "scale-105" : "scale-100"
              }`}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-14">
                <div className="max-w-3xl text-white">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-600/15 px-4 py-2 text-xs font-bold tracking-[0.18em] text-red-300 sm:text-sm">
                    <Zap size={15} />
                    {slide.eyebrow}
                  </div>

                  <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                    {slide.title.split(".")[0]}
                    <span className="text-red-500">.</span>
                    <br />
                    <span className="text-gray-300">
                      {index === 0
                        ? "Your journey starts now."
                        : index === 1
                        ? "Your work. Your results."
                        : index === 2
                        ? "Your strength. Your rules."
                        : "Your workout. Your way."}
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                    {slide.description}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/equipment")}
                      className="group inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-700 sm:px-8 sm:text-base"
                    >
                      <ShoppingBag size={19} />
                      Explore Equipment
                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>

                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <CircleCheck size={18} className="text-red-400" />
                      Built for your training
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:border-red-400 hover:bg-red-600 sm:left-6 sm:h-12 sm:w-12"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:border-red-400 hover:bg-red-600 sm:right-6 sm:h-12 sm:w-12"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-md">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-9 bg-red-500"
                  : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 z-10 hidden text-xs font-semibold tracking-[0.2em] text-white/70 md:block">
          0{currentSlide + 1} <span className="mx-2 text-red-500">/</span> 0
          {slides.length}
        </div>
      </section>

      {/* BRAND INTRO */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-red-600 sm:text-sm">
            <Dumbbell size={16} />
            The Workout standard
          </div>

          <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Train hard.
            <span className="text-red-600"> Stay strong.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Discover workout and calisthenics equipment designed to support
            every stage of your fitness journey. Find the right gear, sharpen
            your technique, and make every session count.
          </p>

          <button
            type="button"
            onClick={() => navigate("/equipment")}
            className="mt-8 inline-flex items-center gap-2 border-b-2 border-red-600 pb-2 text-sm font-bold text-gray-950 transition hover:gap-4 hover:text-red-600"
          >
            Browse all equipment
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="bg-[#f8f8f8] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-600 sm:text-sm">
                Find your essentials
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Gear up for greatness.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Training essentials for strength, control, and bodyweight
                mastery.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/equipment")}
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-red-600 transition hover:gap-3"
            >
              View all products
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => navigate("/equipment")}
                  className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 sm:p-8"
                >
                  <div className="absolute right-5 top-5 text-5xl font-black tracking-tighter text-gray-100 transition group-hover:text-red-50">
                    {category.number}
                  </div>

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20 transition duration-300 group-hover:scale-105 group-hover:bg-red-700">
                    <Icon size={28} />
                  </div>

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-red-600">
                    {category.subtitle}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950">
                    {category.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {category.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-bold text-gray-950 transition group-hover:text-red-600">
                    Explore collection
                    <MoveUpRight
                      size={18}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* RED STATS STRIP */}
      <section className="relative overflow-hidden bg-red-600 px-5 py-14 text-white sm:px-8 sm:py-16">
        <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border-[40px] border-white/5" />
        <div className="absolute -bottom-36 left-1/4 h-72 w-72 rounded-full border-[40px] border-white/5" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100 sm:text-sm">
              Made for movement
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Your fitness. Your commitment.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {[
              { value: "10K+", label: "Happy Athletes" },
              { value: "500+", label: "Products" },
              { value: "50+", label: "Countries" },
              { value: "4.9/5", label: "Customer Rating", icon: Star },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="border-white/20 text-center even:border-l md:border-r md:last:border-r-0"
                >
                  <div className="flex items-center justify-center gap-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    {stat.value}
                    {Icon && <Icon size={23} fill="currentColor" />}
                  </div>
                  <p className="mt-2 text-xs font-medium text-red-100 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-3xl border border-red-100 bg-red-50 p-7 sm:p-10 md:flex-row md:items-center lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-red-600">
              <Zap size={15} />
              The next rep starts here
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Ready to level up your training?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Explore the equipment that helps you turn your goals into
              progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/equipment")}
            className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/15 transition hover:-translate-y-0.5 hover:bg-red-700"
          >
            Shop equipment
            <ArrowRight
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
