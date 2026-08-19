import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import AnimatedSection from '../components/ui/AnimatedSection'

const SECTIONS = [
  {
    id: 'introduction',
    title: 'Privacy Policy',
    content: [
      'At allhealth.tech, accessible from www.allhealth.tech, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by allhealth.tech and how we use it.',
      'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.',
      'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in allhealth.tech. This policy is not applicable to any information collected offline or via channels other than this website.',
    ],
  },
  {
    id: 'consent',
    title: 'Consent',
    content: [
      'By using our website, you hereby consent to our Privacy Policy and agree to its terms.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: [
      'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.',
      'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.',
      'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    list: [
      'Provide, operate, and maintain our website',
      'Improve, personalize, and expand our website',
      'Understand and analyze how you use our website',
      'Develop new products, services, features, and functionality',
      'Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes',
      'Send you emails',
      'Find and prevent fraud',
    ],
  },
  {
    id: 'log-files',
    title: 'Log Files',
    content: [
      'allhealth.tech follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and are a part of hosting services\' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users\' movement on the website, and gathering demographic information.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and Web Beacons',
    content: [
      'Like any other website, allhealth.tech uses \'cookies\'. These cookies are used to store information including visitors\' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users\' experience by customizing our web page content based on visitors\' browser type and/or other information.',
    ],
  },
  {
    id: 'third-party',
    title: 'Third Party Privacy Policies',
    content: [
      'allhealth.tech\'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.',
      'You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers\' respective websites.',
    ],
  },
  {
    id: 'ccpa',
    title: 'CCPA Privacy Rights',
    content: [
      'Under the CCPA, among other rights, California consumers have the right to request that a business that collects a consumer\'s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.',
      'Consumers may request that a business delete any personal data about the consumer that a business has collected, and request that a business that sells a consumer\'s personal data, not sell the consumer\'s personal data.',
      'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
    ],
  },
  {
    id: 'gdpr',
    title: 'GDPR Data Protection Rights',
    content: [
      'We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:',
    ],
    rights: [
      { name: 'The right to access', desc: 'You have the right to request copies of your personal data. We may charge you a small fee for this service.' },
      { name: 'The right to rectification', desc: 'You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.' },
      { name: 'The right to erasure', desc: 'You have the right to request that we erase your personal data, under certain conditions.' },
      { name: 'The right to restrict processing', desc: 'You have the right to request that we restrict the processing of your personal data, under certain conditions.' },
      { name: 'The right to object to processing', desc: 'You have the right to object to our processing of your personal data, under certain conditions.' },
      { name: 'The right to data portability', desc: 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.' },
    ],
    footer: 'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
  },
  {
    id: 'children',
    title: "Children's Information",
    content: [
      'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
      'allhealth.tech does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="Legal"
        accentEyebrow
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
        compact
      />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex gap-2 rounded-[var(--radius-pill)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-1.5 shadow-[var(--shadow-card)]">
          <span className="flex-1 rounded-[var(--radius-pill)] bg-[var(--color-navy)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--text-on-dark)]">
            Privacy Policy
          </span>
          <Link
            to="/terms"
            className="flex-1 rounded-[var(--radius-pill)] px-5 py-2.5 text-center text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--color-ice)] hover:text-[var(--text-primary)]"
          >
            Terms &amp; Conditions
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          {SECTIONS.map(({ id, title, content, list, rights, footer }, index) => (
            <AnimatedSection key={id} animation="fadeUp" duration={700} delay={index * 80}>
              <section
                id={id}
                className="scroll-mt-24 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-7 shadow-[var(--shadow-card)]"
              >
                <h2 className="mb-5 font-[var(--font-display)] text-xl font-normal text-[var(--text-primary)]">
                  {title}
                </h2>

                {content && (
                  <div className="flex flex-col gap-3">
                    {content.map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {list && (
                  <ul className="mt-3 flex flex-col gap-2 pl-1">
                    {list.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-magenta)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {rights && (
                  <div className="mt-4 flex flex-col gap-3">
                    {rights.map(({ name, desc }) => (
                      <div key={name} className="rounded-[var(--radius-md)] bg-[var(--color-ice)] px-4 py-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {footer && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{footer}</p>
                )}
              </section>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-14 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-7 shadow-[var(--shadow-card)]">
          <h2 className="mb-2 font-[var(--font-display)] text-xl font-normal text-[var(--text-primary)]">
            Contact Us
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            If you have any questions about this Privacy Policy, you can contact us at{' '}
            <a
              href="mailto:shankarram@allhealthtech.com"
              className="font-medium text-[var(--color-blue-core)] hover:text-[var(--color-blue-deep)]"
            >
              shankarram@allhealthtech.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
