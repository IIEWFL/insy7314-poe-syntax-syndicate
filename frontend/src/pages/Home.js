import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt,
  FaGlobe,
  FaLock,
  FaBolt,
  FaArrowRight
} from 'react-icons/fa';

const Home = () => {
  const teamMembers = [
    { name: 'Kitso Modise', id: 'ST10203704', initial: 'K' },
    { name: 'Nhlanhipho Nhlengethwa', id: 'ST10203637', initial: 'N' },
    { name: 'Mabitsela Malatji', id: 'ST10203658', initial: 'M' },
    { name: 'Tshedza Maluleke', id: 'ST10203296', initial: 'T' }
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-primary-orange" style={{ fontSize: '3rem' }} />,
      title: 'Bank-Grade Security',
      description: 'Advanced encryption and multi-layer security protocols protect every transaction.'
    },
    {
      icon: <FaGlobe className="text-primary-orange" style={{ fontSize: '3rem' }} />,
      title: 'Global Reach',
      description: 'Send payments to over 200 countries with competitive exchange rates.'
    },
    {
      icon: <FaBolt className="text-primary-orange" style={{ fontSize: '3rem' }} />,
      title: 'Lightning Fast',
      description: 'Process international payments in minutes, not days.'
    },
    {
      icon: <FaLock className="text-primary-orange" style={{ fontSize: '3rem' }} />,
      title: 'SWIFT Compliant',
      description: 'Fully compliant with international banking standards and regulations.'
    }
  ];

  const stats = [
    { number: '200+', label: 'Countries Supported' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Customer Support' },
    { number: '256-bit', label: 'SSL Encryption' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100" style={{ paddingTop: '80px' }}>
            <Col lg={6} className="hero-content">
              <div className="fade-in">
                <h1 className="display-4 fw-bold mb-4">
                  International Payment System
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.3rem', opacity: 0.9 }}>
                  Secure Transactions. Simplified Payments.
                </p>
                <p className="mb-5" style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                  Streamline your international payments with our secure SWIFT-based payment system. 
                  Our platform ensures that your transactions are safe, efficient, and globally compliant.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button 
                    as={Link} 
                    to="/register" 
                    size="lg"
                    className="btn-primary-orange px-5 py-3"
                    style={{ fontSize: '1.1rem', borderRadius: '30px' }}
                  >
                    Get Started <FaArrowRight className="ms-2" />
                  </Button>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-light" 
                    size="lg"
                    className="px-5 py-3"
                    style={{ fontSize: '1.1rem', borderRadius: '30px' }}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="slide-in-right">
                <div className="hero-graphic p-5">
                  <FaGlobe 
                    style={{ 
                      fontSize: '12rem', 
                      color: 'rgba(255, 255, 255, 0.2)',
                      animation: 'float 3s ease-in-out infinite'
                    }} 
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} key={index} className="text-center mb-4">
                <div className="stats-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="stats-number">{stat.number}</span>
                  <div className="stats-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light-orange">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title fade-in">Our Payment Portal Features</h2>
              <p className="section-subtitle fade-in">
                Streamline your international payments with our secure SWIFT-based payment system. 
                Our platform ensures that your transactions are safe, efficient, and globally compliant.
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className="feature-card h-100 text-center fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <Card.Body className="p-4">
                    <div className="mb-3">{feature.icon}</div>
                    <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title fade-in">Meet Our Team</h2>
              <p className="section-subtitle fade-in">
                The talented developers behind your secure payment experience
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {teamMembers.map((member, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <div className="team-card fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="team-avatar">
                    {member.initial}
                  </div>
                  <h5 className="fw-bold mb-2">{member.name}</h5>
                  <p className="text-muted mb-0">{member.id}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 gradient-bg text-white">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-5 fw-bold mb-4 fade-in">
                Ready to Start Your Secure Payment Journey?
              </h2>
              <p className="lead mb-5 fade-in">
                Join thousands of users who trust our platform for their international transactions
              </p>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-light" 
                size="lg"
                className="px-5 py-3 fade-in"
                style={{ fontSize: '1.2rem', borderRadius: '30px', borderWidth: '2px' }}
              >
                Create Your Account <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

// Add floating animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;
document.head.appendChild(style);

export default Home;
