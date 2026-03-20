import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Dumbbell, Zap, Shield, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate()
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
      title: "Transform Your Body",
      description: "Premium calisthenics equipment for serious athletes",
      gradient: "from-red-600/80 to-black/80"
    },
    {
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=600&fit=crop",
      title: "Train Like a Champion",
      description: "Professional-grade gear for peak performance",
      gradient: "from-orange-600/80 to-black/80"
    },
    {
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=600&fit=crop",
      title: "Build Real Strength",
      description: "Master bodyweight training with our equipment",
      gradient: "from-red-700/80 to-gray-900/80"
    },
    {
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&h=600&fit=crop",
      title: "Outdoor & Indoor",
      description: "Versatile equipment for any training environment",
      gradient: "from-slate-700/80 to-black/80"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-6 max-w-4xl">
                <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h2>
                <p className="text-xl md:text-2xl opacity-90 animate-fade-in-delay mb-8">
                  {slide.description}
                </p>
                <button className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2" onClick={() => navigate("/equipment")}>
                  Shop Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentSlide
                  ? "w-12 h-3 bg-red-600"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Text Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap size={16} />
            Premium Equipment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
            Train Hard. Stay Strong.
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover the ultimate range of workout and calisthenics equipment designed for athletes of every level. Whether you're at the gym or training outdoors — we've got you covered.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pull-up Bars Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Dumbbell className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Pull-up Bars</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Durable and versatile bars for full-body calisthenics training. Built to last and support your fitness journey.
                </p>
                <button className="group/btn inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all">
                  Explore Products
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Parallettes Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500" />
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Parallettes</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Perfect for push-ups, dips, and L-sits — compact yet powerful. Take your calisthenics to the next level.
                </p>
                <button className="group/btn inline-flex items-center gap-2 text-orange-600 font-semibold hover:gap-3 transition-all">
                  Explore Products
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Resistance Bands Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-red-500" />
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Resistance Bands</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Train smarter with high-tension bands that challenge your limits. Versatile and portable for any workout.
                </p>
                <button className="group/btn inline-flex items-center gap-2 text-yellow-600 font-semibold hover:gap-3 transition-all">
                  Explore Products
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-red-100 text-sm md:text-base">Happy Athletes</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-red-100 text-sm md:text-base">Products</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-red-100 text-sm md:text-base">Countries</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
                <div className="text-red-100 text-sm md:text-base">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;