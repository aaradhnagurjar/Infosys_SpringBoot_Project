const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "👩‍💼",
      description: "Leading InsurAi with 15+ years in insurance technology.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "👨‍💻",
      description: "Building cutting-edge AI solutions for insurance.",
    },
    {
      name: "Emily Davis",
      role: "Head of Customer Success",
      image: "👩‍🎓",
      description: "Ensuring exceptional customer experiences.",
    },
    {
      name: "David Wilson",
      role: "AI Research Lead",
      image: "👨‍🔬",
      description: "Pioneering the future of AI-powered insurance.",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Innovation",
      description:
        "We constantly push the boundaries of what's possible in insurance technology.",
    },
    {
      icon: "🤝",
      title: "Trust",
      description:
        "Building lasting relationships through transparency and reliability.",
    },
    {
      icon: "⚡",
      title: "Excellence",
      description:
        "Delivering superior service and solutions that exceed expectations.",
    },
    {
      icon: "🌟",
      title: "Customer First",
      description:
        "Every decision we make is guided by what's best for our customers.",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About InsurAi
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're revolutionizing the insurance industry with AI-powered
            solutions that make insurance simple, accessible, and intelligent
            for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, InsurAi emerged from a simple yet powerful
                  vision: to make insurance work better for everyone through the
                  power of artificial intelligence.
                </p>
                <p>
                  Our founders, having experienced the frustrations of
                  traditional insurance firsthand, set out to create a platform
                  that would eliminate the complexity, reduce costs, and provide
                  instant, personalized service.
                </p>
                <p>
                  Today, we're proud to serve over 100,000 customers worldwide,
                  processing millions in claims with our AI-powered platform
                  that never sleeps.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-blue-100">
                  To democratize insurance by making it intelligent, accessible,
                  and fair for everyone, powered by cutting-edge AI technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16 bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The brilliant minds behind InsurAi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
