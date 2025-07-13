# Product Requirements Document (PRD)
## CareerOS - EdTech Platform for Career Development

**Document Version**: 1.0  
**Date**: July 13, 2025  
**Status**: Active Development  
**Team**: CareerOS Development Team  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [Market Analysis](#market-analysis)
4. [User Personas](#user-personas)
5. [Product Goals and Objectives](#product-goals-and-objectives)
6. [Feature Requirements](#feature-requirements)
7. [Technical Requirements](#technical-requirements)
8. [User Experience Requirements](#user-experience-requirements)
9. [Security and Privacy Requirements](#security-and-privacy-requirements)
10. [Performance Requirements](#performance-requirements)
11. [Integration Requirements](#integration-requirements)
12. [Compliance and Regulatory Requirements](#compliance-and-regulatory-requirements)
13. [Success Metrics](#success-metrics)
14. [Risk Assessment](#risk-assessment)
15. [Implementation Roadmap](#implementation-roadmap)
16. [Appendices](#appendices)

---

## Executive Summary

### Problem Statement
Indian students face significant challenges in career development due to:
- Lack of personalized career guidance
- Limited access to industry mentors
- Inadequate practical learning opportunities
- Poor job market preparation
- Insufficient skill development resources

### Solution Overview
CareerOS is a comprehensive EdTech platform that provides:
- AI-powered career guidance and recommendations
- Structured learning paths with courses and projects
- Mentorship matching and community engagement
- Resume building and interview preparation tools
- Real-time progress tracking and analytics

### Key Success Metrics
- **User Engagement**: 75% monthly active users
- **Career Outcomes**: 60% job placement rate within 6 months
- **User Satisfaction**: 4.5+ star rating
- **Platform Growth**: 100,000+ registered users in first year
- **Revenue**: $1M ARR by end of Year 1

---

## Product Overview

### Vision Statement
To become India's leading career development platform that empowers students to discover, develop, and achieve their professional aspirations through personalized learning and mentorship.

### Mission Statement
We provide comprehensive career guidance, practical learning opportunities, and industry connections to help Indian students transition successfully from education to employment.

### Value Proposition
- **Personalized Learning**: AI-driven career recommendations and learning paths
- **Industry Connections**: Direct access to mentors and industry professionals
- **Practical Skills**: Project-based learning with real-world applications
- **Career Readiness**: Complete job preparation tools and resources
- **Community Support**: Peer learning and collaborative growth

### Target Market
- **Primary**: Indian college students (ages 18-25) in engineering, technology, and business programs
- **Secondary**: Recent graduates seeking career transitions
- **Tertiary**: Working professionals looking for skill upgrades

---

## Market Analysis

### Market Size and Opportunity
- **Total Addressable Market (TAM)**: $2.8B (Indian EdTech market)
- **Serviceable Addressable Market (SAM)**: $850M (Career development segment)
- **Serviceable Obtainable Market (SOM)**: $85M (Targeted segments)

### Competitive Analysis

#### Direct Competitors
1. **Unacademy** - Broad educational platform
2. **UpGrad** - Professional skill development
3. **Scaler** - Tech-focused career platform
4. **Coursera/edX** - Global online learning platforms

#### Competitive Advantages
- **Indian Market Focus**: Tailored for Indian job market and cultural context
- **Holistic Approach**: Complete career development lifecycle
- **AI Integration**: Personalized recommendations and guidance
- **Community Building**: Strong peer and mentor networks
- **Practical Focus**: Project-based learning and portfolio building

### Market Trends
- Growing demand for skill-based education
- Increasing acceptance of online learning
- Rising importance of career guidance
- AI adoption in educational technology
- Focus on employability and job readiness

---

## User Personas

### 1. Primary Persona: College Student (Arjun)
**Demographics**: 20-year-old engineering student, Tier-2 city, middle-class family
**Goals**: 
- Discover suitable career paths
- Develop relevant skills for job market
- Build professional network
- Prepare for campus placements

**Pain Points**:
- Unclear about career options
- Lacks industry exposure
- Limited access to mentors
- Poor interview preparation

**User Journey**:
1. Registration and career assessment
2. Personalized dashboard and recommendations
3. Course enrollment and learning
4. Community engagement and networking
5. Resume building and job preparation

### 2. Secondary Persona: Recent Graduate (Priya)
**Demographics**: 22-year-old computer science graduate, metropolitan city, seeking first job
**Goals**:
- Enhance technical skills
- Build professional portfolio
- Network with industry professionals
- Secure employment in tech industry

**Pain Points**:
- Skills gap for industry requirements
- Limited professional network
- Lack of practical experience
- Difficulty in job search

### 3. Tertiary Persona: Career Changer (Raj)
**Demographics**: 28-year-old working professional, wants to transition to tech
**Goals**:
- Learn new technical skills
- Build portfolio projects
- Connect with industry mentors
- Successfully transition careers

**Pain Points**:
- Time constraints for learning
- Outdated skills for new industry
- Lack of relevant experience
- Uncertainty about career transition

### 4. Mentor Persona: Industry Professional (Dr. Sharma)
**Demographics**: 35-year-old senior software architect, wants to give back to community
**Goals**:
- Share knowledge and experience
- Guide next generation of professionals
- Build personal brand
- Contribute to industry growth

**Motivations**:
- Personal fulfillment from helping others
- Professional networking opportunities
- Industry recognition and visibility
- Continuous learning through teaching

---

## Product Goals and Objectives

### Primary Goals
1. **User Acquisition**: Acquire 100,000 registered users within 12 months
2. **User Engagement**: Achieve 75% monthly active user rate
3. **Career Outcomes**: Enable 60% job placement rate for active users
4. **Revenue Growth**: Generate $1M ARR by end of Year 1
5. **Market Position**: Become top-3 career development platform in India

### Secondary Goals
1. **Platform Quality**: Maintain 4.5+ star user rating
2. **Content Quality**: Develop 500+ courses and 200+ projects
3. **Community Building**: Build network of 1,000+ active mentors
4. **Technology Excellence**: Achieve 99.9% uptime and <200ms response times
5. **Partnerships**: Establish partnerships with 50+ educational institutions

### Success Criteria
- **User Metrics**: DAU/MAU ratio >30%, retention rate >70%
- **Engagement Metrics**: Session duration >20 minutes, course completion rate >60%
- **Business Metrics**: Monthly revenue growth >15%, customer acquisition cost <$25
- **Quality Metrics**: Bug resolution time <24 hours, user satisfaction >4.5/5

---

## Feature Requirements

### Core Features

#### 1. User Authentication and Profile Management
**Priority**: P0 (Must Have)
**Description**: Secure user registration, authentication, and profile management system

**Functional Requirements**:
- User registration with email/phone verification
- Social login integration (Google, GitHub, LinkedIn)
- Two-factor authentication support
- Role-based access control (Student, Mentor, Moderator, Admin)
- Profile creation and management
- Avatar upload and profile customization

**Technical Requirements**:
- JWT-based authentication
- OAuth 2.0 integration
- RBAC implementation
- Session management
- Password security (bcrypt hashing)
- Account recovery system

**Acceptance Criteria**:
- Users can register and verify accounts within 2 minutes
- Social login works for 95% of users
- Password reset functionality works reliably
- User roles are enforced throughout the system

#### 2. Career Assessment and Recommendation Engine
**Priority**: P0 (Must Have)
**Description**: AI-powered career assessment and personalized recommendations

**Functional Requirements**:
- Interactive career assessment questionnaire
- Skill gap analysis
- Personality and interest profiling
- Career path recommendations
- Learning path suggestions
- Job market alignment analysis

**Technical Requirements**:
- AI/ML algorithms for assessment scoring
- Integration with OpenAI API
- Recommendation engine with filtering
- Real-time assessment processing
- Career database with Indian job market data

**Acceptance Criteria**:
- Assessment completion rate >80%
- Recommendation accuracy >75% (user feedback)
- Assessment results delivered within 30 seconds
- Personalized recommendations updated weekly

#### 3. Learning Management System
**Priority**: P0 (Must Have)
**Description**: Comprehensive course and project management system

**Functional Requirements**:
- Course catalog with search and filtering
- Video content delivery and progress tracking
- Interactive quizzes and assessments
- Project assignments and submissions
- Progress tracking and analytics
- Certification system

**Technical Requirements**:
- Video streaming infrastructure
- Quiz engine with automatic grading
- File upload and storage system
- Progress tracking database
- Certificate generation system

**Acceptance Criteria**:
- Course completion rate >60%
- Video buffering <5% of playback time
- Quiz results available instantly
- Progress synchronization across devices

#### 4. Mentorship and Community Platform
**Priority**: P0 (Must Have)
**Description**: Mentor matching and community engagement system

**Functional Requirements**:
- Mentor profile creation and verification
- Mentorship matching algorithm
- Session scheduling and management
- Community forums and discussions
- Peer-to-peer learning features
- Mentorship tracking and feedback

**Technical Requirements**:
- Matching algorithm with ML components
- Calendar integration for scheduling
- Real-time messaging system
- Community moderation tools
- Feedback and rating system

**Acceptance Criteria**:
- Mentor-mentee matching accuracy >80%
- Average response time <24 hours
- Community engagement rate >40%
- Session completion rate >90%

#### 5. Resume Builder and Portfolio Management
**Priority**: P0 (Must Have)
**Description**: Professional resume and portfolio creation tools

**Functional Requirements**:
- Multiple resume templates
- Drag-and-drop resume builder
- Portfolio project showcase
- LinkedIn profile integration
- ATS optimization suggestions
- Export functionality (PDF, DOCX)

**Technical Requirements**:
- Template rendering engine
- PDF generation system
- LinkedIn API integration
- ATS keyword optimization
- File export capabilities

**Acceptance Criteria**:
- Resume creation completion rate >70%
- Export functionality works for all formats
- LinkedIn sync accuracy >95%
- ATS optimization score >80%

### Advanced Features

#### 6. AI Career Coach
**Priority**: P1 (Should Have)
**Description**: Conversational AI assistant for career guidance

**Functional Requirements**:
- Natural language processing for career queries
- Personalized career advice and recommendations
- Interview preparation assistance
- Skill development guidance
- Career path planning support

**Technical Requirements**:
- OpenAI GPT integration
- Context-aware conversation management
- User data personalization
- Response accuracy optimization
- Conversation history tracking

#### 7. Analytics and Insights Dashboard
**Priority**: P1 (Should Have)
**Description**: Comprehensive analytics for users and administrators

**Functional Requirements**:
- Personal learning analytics
- Career progress tracking
- Platform usage statistics
- Performance metrics and KPIs
- Predictive analytics for career outcomes

**Technical Requirements**:
- Data visualization libraries
- Real-time analytics processing
- Data warehouse integration
- Machine learning for predictions
- Export and reporting capabilities

#### 8. Mobile Application
**Priority**: P2 (Nice to Have)
**Description**: Mobile app for iOS and Android platforms

**Functional Requirements**:
- Mobile-optimized user interface
- Offline content access
- Push notifications
- Mobile-specific features
- Cross-platform synchronization

**Technical Requirements**:
- React Native development
- Offline storage capabilities
- Push notification service
- Mobile-specific APIs
- App store deployment

---

## Technical Requirements

### Architecture Requirements

#### System Architecture
- **Frontend**: React 18 with TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with OAuth 2.0 integration
- **API Design**: RESTful APIs with OpenAPI documentation
- **File Storage**: Cloud storage with CDN integration
- **Deployment**: Container-based deployment with CI/CD pipeline

#### Scalability Requirements
- **Horizontal Scaling**: Support for load balancing and auto-scaling
- **Database Scaling**: Read replicas and connection pooling
- **Caching Strategy**: Multi-layer caching with Redis
- **CDN Integration**: Global content delivery network
- **Microservices Ready**: Modular architecture for future scaling

#### Performance Requirements
- **Response Time**: <200ms for API responses
- **Page Load Time**: <3 seconds for initial load
- **Concurrent Users**: Support for 10,000+ concurrent users
- **Database Performance**: <100ms query execution time
- **Uptime**: 99.9% availability requirement

### Data Requirements

#### Data Models
- **User Data**: Profile, preferences, progress, achievements
- **Content Data**: Courses, projects, assessments, resources
- **Community Data**: Posts, comments, mentorship relationships
- **Analytics Data**: User behavior, engagement metrics, outcomes
- **System Data**: Logs, configurations, security events

#### Data Storage
- **Primary Database**: PostgreSQL for transactional data
- **Cache Layer**: Redis for session and application cache
- **File Storage**: Cloud storage for media and documents
- **Backup Strategy**: Daily automated backups with retention policy
- **Data Archival**: Long-term storage for historical data

#### Data Security
- **Encryption**: At-rest and in-transit encryption
- **Access Control**: Role-based data access permissions
- **Audit Logging**: Complete audit trail for data access
- **Privacy Compliance**: GDPR and local privacy law compliance
- **Data Retention**: Automated data retention policies

### Integration Requirements

#### Third-Party Integrations
- **OAuth Providers**: Google, GitHub, LinkedIn
- **Payment Gateway**: Razorpay, Stripe for Indian market
- **Email Service**: Professional email delivery service
- **SMS Service**: OTP and notification delivery
- **AI Services**: OpenAI API for intelligent features
- **Video Service**: Video streaming and storage platform

#### API Requirements
- **API Documentation**: OpenAPI/Swagger specification
- **API Security**: OAuth 2.0 and API key authentication
- **Rate Limiting**: Request throttling and abuse prevention
- **API Versioning**: Backward compatibility maintenance
- **Monitoring**: API performance and health monitoring

---

## User Experience Requirements

### Design Principles
- **User-Centric**: Design decisions based on user research and feedback
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Performance**: Fast loading and smooth interactions
- **Consistency**: Uniform design language and interaction patterns

### User Interface Requirements
- **Visual Design**: Modern, clean, and professional appearance
- **Navigation**: Intuitive navigation with clear information architecture
- **Responsive Design**: Optimal experience across all device sizes
- **Accessibility**: Screen reader compatibility and keyboard navigation
- **Internationalization**: Support for multiple languages (Hindi, English)

### User Journey Requirements
- **Onboarding**: Guided user onboarding with clear value proposition
- **Discovery**: Easy content discovery and search functionality
- **Engagement**: Interactive features to maintain user engagement
- **Progress Tracking**: Clear progress indicators and achievement system
- **Support**: Contextual help and comprehensive support documentation

### Usability Requirements
- **Ease of Use**: Intuitive interface requiring minimal learning
- **Error Prevention**: Clear validation and error prevention mechanisms
- **Feedback**: Immediate feedback for user actions
- **Efficiency**: Streamlined workflows for common tasks
- **Satisfaction**: Enjoyable and rewarding user experience

---

## Security and Privacy Requirements

### Authentication and Authorization
- **Multi-Factor Authentication**: Optional 2FA for enhanced security
- **Session Management**: Secure session handling with automatic timeout
- **Password Security**: Strong password requirements and secure storage
- **Access Control**: Role-based permissions and resource protection
- **Account Recovery**: Secure account recovery mechanisms

### Data Protection
- **Data Encryption**: AES-256 encryption for sensitive data
- **Transport Security**: HTTPS/TLS for all communications
- **Input Validation**: Comprehensive input sanitization and validation
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content sanitization and CSP headers

### Privacy Compliance
- **Data Minimization**: Collect only necessary user data
- **Consent Management**: Clear consent mechanisms for data collection
- **Data Portability**: User data export capabilities
- **Right to Deletion**: User data deletion on request
- **Privacy Policy**: Comprehensive privacy policy and terms of service

### Security Monitoring
- **Intrusion Detection**: Automated threat detection and response
- **Audit Logging**: Comprehensive security event logging
- **Vulnerability Management**: Regular security assessments and updates
- **Incident Response**: Defined incident response procedures
- **Security Training**: Regular security awareness training for team

---

## Performance Requirements

### System Performance
- **Response Time**: 95% of API requests under 200ms
- **Throughput**: Handle 1,000+ requests per second
- **Concurrent Users**: Support 10,000+ simultaneous users
- **Database Performance**: Query execution under 100ms
- **File Upload**: Support files up to 100MB with progress tracking

### Application Performance
- **Page Load Time**: Initial page load under 3 seconds
- **Time to Interactive**: Under 5 seconds for main pages
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Mobile Performance**: Optimized for 3G network conditions
- **Offline Capability**: Basic functionality available offline

### Scalability Requirements
- **Auto-Scaling**: Automatic scaling based on demand
- **Load Balancing**: Distribute traffic across multiple servers
- **Database Scaling**: Read replicas and connection pooling
- **CDN Integration**: Global content delivery for static assets
- **Caching Strategy**: Multi-layer caching for optimal performance

### Monitoring and Alerting
- **Performance Monitoring**: Real-time performance tracking
- **Error Tracking**: Comprehensive error logging and alerting
- **Health Checks**: System health monitoring and alerts
- **Capacity Planning**: Proactive capacity monitoring and planning
- **SLA Monitoring**: Service level agreement compliance tracking

---

## Integration Requirements

### Educational Institution Integrations
- **LMS Integration**: Connect with existing Learning Management Systems
- **Student Information Systems**: Sync with college databases
- **Academic Calendar**: Integration with institutional schedules
- **Grading Systems**: Export progress to academic systems
- **Certificate Verification**: Integration with credential verification systems

### Industry Partner Integrations
- **Job Boards**: Integration with major job posting platforms
- **Company Portals**: Direct connections to company hiring systems
- **Skill Assessment**: Integration with industry assessment tools
- **Certification Bodies**: Connect with professional certification programs
- **Industry Databases**: Access to job market and salary data

### Technology Integrations
- **Cloud Services**: AWS/Azure/GCP for infrastructure
- **Analytics Platforms**: Google Analytics, Mixpanel for user analytics
- **Communication Tools**: Slack, Discord for community features
- **Video Conferencing**: Zoom, Teams for virtual mentoring sessions
- **Development Tools**: GitHub, GitLab for project portfolio integration

---

## Compliance and Regulatory Requirements

### Data Protection Regulations
- **GDPR Compliance**: European data protection regulation compliance
- **Indian IT Act**: Compliance with Indian Information Technology Act
- **CCPA Compliance**: California Consumer Privacy Act requirements
- **Data Localization**: Indian data residency requirements
- **Sector-Specific Regulations**: Education sector compliance requirements

### Educational Compliance
- **FERPA Compliance**: Educational records privacy requirements
- **Accessibility Standards**: WCAG 2.1 AA compliance
- **Age Verification**: Compliance with age restrictions for minors
- **Content Standards**: Educational content quality standards
- **Certification Requirements**: Industry certification compliance

### Business Compliance
- **Financial Regulations**: Payment processing compliance
- **Tax Compliance**: Indian GST and international tax requirements
- **Employment Law**: Mentorship and contractor regulations
- **Intellectual Property**: Copyright and trademark compliance
- **Consumer Protection**: Consumer rights and protection compliance

---

## Success Metrics

### User Metrics
- **User Acquisition**: 100,000 registered users in Year 1
- **User Activation**: 80% complete onboarding within 7 days
- **User Retention**: 70% monthly active users
- **User Engagement**: 30% daily active users
- **Session Duration**: Average 25+ minutes per session

### Learning Metrics
- **Course Completion**: 60% course completion rate
- **Skill Development**: 75% users show skill improvement
- **Project Portfolio**: 50% users create complete portfolios
- **Certification**: 40% users earn platform certifications
- **Knowledge Retention**: 80% pass rates on assessments

### Career Outcome Metrics
- **Job Placement**: 60% job placement rate within 6 months
- **Salary Improvement**: 30% average salary increase
- **Career Satisfaction**: 85% career satisfaction rating
- **Interview Success**: 70% interview success rate
- **Skill-Job Match**: 80% working in recommended fields

### Business Metrics
- **Revenue Growth**: $1M ARR by end of Year 1
- **Customer Acquisition Cost**: <$25 CAC
- **Customer Lifetime Value**: >$150 CLV
- **Monthly Recurring Revenue**: 15% month-over-month growth
- **Conversion Rate**: 10% free-to-paid conversion rate

### Quality Metrics
- **User Satisfaction**: 4.5+ star rating
- **System Uptime**: 99.9% availability
- **Bug Resolution**: <24 hours for critical issues
- **Support Response**: <2 hours for support tickets
- **Content Quality**: 90% content approval rating

---

## Risk Assessment

### Technical Risks
- **Risk**: Scalability challenges with rapid user growth
  - **Impact**: High
  - **Probability**: Medium
  - **Mitigation**: Implement auto-scaling and load balancing

- **Risk**: Third-party API dependencies and limitations
  - **Impact**: Medium
  - **Probability**: High
  - **Mitigation**: Implement fallback systems and alternative providers

- **Risk**: Data security breaches and privacy violations
  - **Impact**: High
  - **Probability**: Low
  - **Mitigation**: Comprehensive security measures and regular audits

### Market Risks
- **Risk**: Competitive pressure from established players
  - **Impact**: High
  - **Probability**: High
  - **Mitigation**: Focus on unique value proposition and rapid innovation

- **Risk**: Economic downturn affecting education spending
  - **Impact**: Medium
  - **Probability**: Medium
  - **Mitigation**: Diversified revenue streams and cost optimization

- **Risk**: Regulatory changes in education or data protection
  - **Impact**: Medium
  - **Probability**: Medium
  - **Mitigation**: Proactive compliance monitoring and adaptation

### Operational Risks
- **Risk**: Key talent acquisition and retention challenges
  - **Impact**: High
  - **Probability**: Medium
  - **Mitigation**: Competitive compensation and strong company culture

- **Risk**: Content quality and relevance maintenance
  - **Impact**: Medium
  - **Probability**: Medium
  - **Mitigation**: Regular content reviews and industry partnerships

- **Risk**: User adoption and engagement challenges
  - **Impact**: High
  - **Probability**: Medium
  - **Mitigation**: User research, feedback loops, and continuous improvement

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-3)
**MVP Development**
- Core authentication and user management
- Basic course catalog and learning features
- Simple mentorship matching
- Essential resume builder
- Basic analytics dashboard

**Success Criteria**:
- 1,000 beta users
- Core features functional
- Basic user feedback collection
- Initial mentor onboarding

### Phase 2: Growth (Months 4-6)
**Feature Enhancement**
- Advanced career assessment
- AI-powered recommendations
- Enhanced community features
- Mobile-responsive design
- Payment integration

**Success Criteria**:
- 10,000 registered users
- 50% course completion rate
- 100 active mentors
- Revenue generation started

### Phase 3: Scale (Months 7-9)
**Platform Expansion**
- Advanced analytics and insights
- AI career coach integration
- Partnership integrations
- Performance optimization
- Advanced security features

**Success Criteria**:
- 50,000 registered users
- 70% user retention rate
- 500 active mentors
- Significant revenue growth

### Phase 4: Optimization (Months 10-12)
**Enterprise Features**
- Institutional partnerships
- Advanced certification system
- Mobile application launch
- Enterprise sales features
- International expansion prep

**Success Criteria**:
- 100,000 registered users
- $1M ARR achieved
- 1,000 active mentors
- Market leadership position

---

## Appendices

### Appendix A: Technical Specifications
- Database schema documentation
- API endpoint specifications
- Security implementation details
- Performance benchmarks
- Integration protocols

### Appendix B: User Research Data
- User interview transcripts
- Survey results and analysis
- Persona development research
- Market research findings
- Competitive analysis details

### Appendix C: Design Guidelines
- UI/UX design system
- Brand guidelines and standards
- Accessibility compliance checklist
- Mobile design specifications
- Internationalization guidelines

### Appendix D: Compliance Documentation
- Privacy policy template
- Terms of service template
- Data protection impact assessment
- Security compliance checklist
- Regulatory compliance matrix

### Appendix E: Testing Specifications
- Test case documentation
- Performance testing criteria
- Security testing protocols
- User acceptance testing plans
- Quality assurance procedures

---

**Document Control**
- **Created**: July 13, 2025
- **Last Updated**: July 13, 2025
- **Version**: 1.0
- **Next Review**: August 13, 2025
- **Owner**: Product Team
- **Stakeholders**: Engineering, Design, Marketing, Sales, Legal

**Approval**
- **Product Manager**: [Signature Required]
- **Engineering Lead**: [Signature Required]
- **Design Lead**: [Signature Required]
- **Business Lead**: [Signature Required]