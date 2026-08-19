import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import AnimatedSection from '../components/ui/AnimatedSection'

const DEFINITIONS = [
  { term: 'Affiliate', def: 'An entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.' },
  { term: 'Country', def: 'Karnataka, India' },
  { term: 'Company', def: 'Referred to as either "the Company", "We", "Us" or "Our" in this Agreement — refers to All Health X Tech Summit.' },
  { term: 'Device', def: 'Any device that can access the Service such as a computer, a cellphone or a digital tablet.' },
  { term: 'Service', def: 'Refers to the Website.' },
  { term: 'Terms and Conditions', def: 'These Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.' },
  { term: 'Third-party Social Media Service', def: 'Any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.' },
  { term: 'Website', def: 'Refers to All Health X Tech Summit, accessible from www.allhealth.tech' },
  { term: 'You', def: 'The individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.' },
]

const SECTIONS = [
  {
    id: 'interpretation',
    title: 'Interpretation and Definitions',
    content: [
      'The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.',
    ],
    hasDefinitions: true,
  },
  {
    id: 'acknowledgment',
    title: 'Acknowledgment',
    content: [
      'These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.',
      'Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.',
      'By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.',
      'You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.',
      'Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Please read Our Privacy Policy carefully before using Our Service.',
    ],
  },
  {
    id: 'links',
    title: 'Links to Other Websites',
    content: [
      'Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.',
      'The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.',
      'We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    content: [
      'We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.',
      'Upon termination, Your right to use the Service will cease immediately.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: [
      'Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven\'t purchased anything through the Service.',
      'To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.',
    ],
  },
  {
    id: 'disclaimer',
    title: '"AS IS" and "AS AVAILABLE" Disclaimer',
    content: [
      'The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement.',
      'Without limiting the foregoing, neither the Company nor any of the company\'s provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service is free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: [
      'The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.',
    ],
  },
  {
    id: 'disputes',
    title: 'Disputes Resolution',
    content: [
      'If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company.',
    ],
  },
  {
    id: 'eu-users',
    title: 'For European Union (EU) Users',
    content: [
      'If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in.',
    ],
  },
  {
    id: 'us-compliance',
    title: 'United States Legal Compliance',
    content: [
      'You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.',
    ],
  },
  {
    id: 'severability',
    title: 'Severability and Waiver',
    content: [
      'If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.',
      'Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party\'s ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.',
    ],
  },
  {
    id: 'translation',
    title: 'Translation Interpretation',
    content: [
      'These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to These Terms and Conditions',
    content: [
      'We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days\' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.',
      'By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ice)]">
      <PageHero
        eyebrow="Legal"
        accentEyebrow
        title="Terms & Conditions"
        subtitle="Please read these terms and conditions carefully before using our service."
        compact
      />

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex gap-2 rounded-[var(--radius-pill)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-1.5 shadow-[var(--shadow-card)]">
          <Link
            to="/privacy-policy"
            className="flex-1 rounded-[var(--radius-pill)] px-5 py-2.5 text-center text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--color-ice)] hover:text-[var(--text-primary)]"
          >
            Privacy Policy
          </Link>
          <span className="flex-1 rounded-[var(--radius-pill)] bg-[var(--color-navy)] px-5 py-2.5 text-center text-sm font-semibold text-[var(--text-on-dark)]">
            Terms &amp; Conditions
          </span>
        </div>

        <div className="flex flex-col gap-12">
          {SECTIONS.map(({ id, title, content, hasDefinitions }, index) => (
            <AnimatedSection key={id} animation="fadeUp" duration={700} delay={index * 60}>
              <section
                id={id}
                className="scroll-mt-24 rounded-[var(--radius-card)] border border-[var(--color-mist)] bg-[var(--color-warm-white)] p-7 shadow-[var(--shadow-card)]"
              >
                <h2 className="mb-5 font-[var(--font-display)] text-xl font-normal text-[var(--text-primary)]">
                  {title}
                </h2>

                <div className="flex flex-col gap-3">
                  {content.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {para}
                    </p>
                  ))}
                </div>

                {hasDefinitions && (
                  <div className="mt-5 flex flex-col gap-3">
                    {DEFINITIONS.map(({ term, def }) => (
                      <div key={term} className="rounded-[var(--radius-md)] bg-[var(--color-ice)] px-4 py-3">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{term}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{def}</p>
                      </div>
                    ))}
                  </div>
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
            If you have any questions about these Terms and Conditions, you can contact us at{' '}
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
