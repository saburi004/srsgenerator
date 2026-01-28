"use client";
import Link from 'next/link';

export default function Landing() {
  return (
    <div className="relative bg-black">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image with Overlay - Only for Hero */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-black/80"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center px-6 py-6 md:px-12">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            Phase1
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-900/50 hover:shadow-purple-700/50"
          >
            Get Started
          </Link>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div className="mb-2">
            <span className="inline-block px-4 py-1 bg-purple-900/50 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-700/30">
              The Future of Project Development
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent">
              Phase1
            </span>
          </h1>

          <p className="text-2xl md:text-4xl text-white mb-6 font-medium">
            <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Launch Projects at Warp Speed
            </span>
          </p>

          <p className="text-xl md:text-2xl text-purple-200 mb-10 font-light max-w-3xl">
            Transform your vision into a fully-documented SRS in minutes, not weeks
          </p>

          <p className="text-gray-300 max-w-2xl text-lg mb-12">
            AI-powered precision meets human creativity. From concept to deployment,
            accelerate your entire project lifecycle with intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth"
              className="px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-900/50 hover:shadow-purple-700/50 text-lg"
            >
              🚀 Start Your Project Now
            </Link>
            <button className="px-8 py-4 bg-black/50 backdrop-blur-sm text-gray-300 font-semibold rounded-xl border-2 border-purple-800/50 hover:border-purple-600 hover:bg-black/70 transition-all duration-300 hover:text-white text-lg">
              📺 See Live Demo
            </button>
          </div>



        </div>
      </div>

      {/* Services Section - Separate from Hero */}
      <div className="relative bg-gradient-to-b from-black via-gray-950 to-black py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>

        <div className="relative z-10 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-700/30 mb-4">
                Unified Platform
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-white to-purple-200 bg-clip-text text-transparent">
                  One Ecosystem, Three Perspectives
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Tailored workflows for every stakeholder. Collaborate seamlessly across the entire project lifecycle.
              </p>
            </div>

            {/* Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 - Client */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-purple-700/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 mb-4">
                      <span className="text-3xl">👑</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-purple-900/30 rounded-full text-xs font-medium text-purple-300">
                      For Clients
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Generate SRS in Seconds</h3>
                  <p className="text-gray-400 mb-6">
                    Speak your vision, watch it transform into detailed requirements.
                    Our AI understands your needs and documents them with perfect precision.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Natural language processing</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Instant documentation</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Zero technical knowledge required</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2 - Manager */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-purple-700/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-purple-900/30 rounded-full text-xs font-medium text-purple-300">
                      For Managers
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Real-time Progress Dashboard</h3>
                  <p className="text-gray-400 mb-6">
                    Command center for your projects. Live updates, predictive analytics,
                    and milestone tracking that keeps you three steps ahead.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Live progress tracking</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Predictive analytics</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Automated reporting</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3 - Developer */}
              <div className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

                <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-purple-700/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900 to-purple-700 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 mb-4">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-purple-900/30 rounded-full text-xs font-medium text-purple-300">
                      For Developers
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ask anythings to the SRS document</h3>
                  <p className="text-gray-400 mb-6">
                    No time wasted reading long SRS documents. Get instant,accurate answers from our RAG technology
                    to your questions and save time.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Live progress tracking</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Predictive analytics</span>
                    </li>
                    <li className="flex items-center text-purple-300">
                      <span className="mr-2">✓</span>
                      <span className="text-sm">Automated reporting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview/Video Section */}
      <div className="relative bg-gradient-to-b from-black to-gray-950 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent"></div>

        <div className="relative z-10 px-4 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl shadow-purple-900/10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
                <div className="lg:w-2/3">
                  <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-900/50 to-purple-700/50 rounded-full text-purple-300 text-sm font-medium mb-4">
                    Interactive Preview
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      See the Magic in Action
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    Watch how Phase1 transforms vague ideas into structured, actionable project blueprints in real-time.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <Link
                      href="/auth"
                      className="px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-900/50 text-lg flex items-center gap-2"
                    >
                      <span>🚀</span>
                      <span>Get Started</span>
                    </Link>

                  </div>
                </div>
                <div className="mt-8 lg:mt-0 lg:ml-8">

                </div>
              </div>

              {/* Video Preview Container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 bg-gradient-to-br from-purple-700/80 to-purple-500/80 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-2xl shadow-purple-900/30 group-hover:shadow-purple-700/40 backdrop-blur-sm border border-purple-500/30">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-4xl text-white ml-2">▶</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="absolute bottom-6 left-6 text-left">
                    <p className="text-white text-xl font-semibold">Phase1 Platform Demo</p>
                    <p className="text-purple-300 text-sm">See the complete workflow in 3 minutes</p>
                  </div>

                  {/* Live Badge */}
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-800">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-purple-300 font-semibold">LIVE PREVIEW</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-gray-800">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">AI-Powered</div>
                  <div className="text-gray-400 text-sm">Smart Documentation</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">Real-time</div>
                  <div className="text-gray-400 text-sm">Collaboration</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">Zero</div>
                  <div className="text-gray-400 text-sm">Setup Time</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative bg-gradient-to-b from-gray-950 to-black py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-5"></div>

        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-white to-purple-200 bg-clip-text text-transparent">
              Ready to Revolutionize Your Projects?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of teams who have accelerated their development process with Phase1
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-900/50 text-xl group"
          >
            <span>Try Now !</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

