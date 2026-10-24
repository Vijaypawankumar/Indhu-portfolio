/* ==========================================================
   CONTENT FILE — the only file you need to edit.

   1. Change the text inside the quotation marks.
   2. To add a post, copy a whole { ... }, block inside POSTS,
      paste it above the first one, and change the text.
   3. To hide a post without deleting it, set status: "draft".
   4. Keep every comma and quotation mark where it is.
   ========================================================== */

window.SITE = {
  name: "Indhu",
  display: "Indhu",
  monogram: "I",

  // Your public web address, e.g. "https://yourname.github.io/portfolio". Leave "" until you know it.
  url: "",

  // ---- Home page ----
  eyebrow: "LAW · SOCIETY · POLICY · JUSTICE",
  heroTitle: "Law in Context,\nSociety in *Focus.*",   // *stars* make a word oxblood italic
  heroText: "A collection of my research papers, articles and reflections on contemporary legal issues, public policy and the intersection of law and society.",
  quote: "Law is not merely a profession, but a means to build a more just, inclusive and humane society.",
  footer: "Research papers, articles and reflections on law, policy and society.",

  // ---- About ----
  role: "Law student",
  degree: "B.A. LL.B. (Hons.), 4th year of the 5-year integrated programme",
  institution: "Sri Padmavathi Mahila Vishwavidyalaya, Tirupati, Andhra Pradesh",
  location: "Tirupati, Andhra Pradesh, India",
  bio: "I am a fourth-year student of the five-year integrated B.A. LL.B. (Hons.) programme at Sri Padmavathi Mahila Vishwavidyalaya, Tirupati. My focus is data privacy and AI regulation: the Digital Personal Data Protection Act, 2023, the GDPR, the Information Technology Act, 2000 and the EU AI Act, read against the foundation laid by Justice K.S. Puttaswamy v. Union of India.\n\nI aim to become a data privacy and AI regulation lawyer, and I write here to think these questions through in public.",
  interests: ["Data privacy law", "AI regulation", "DPDP Act, 2023", "GDPR", "IT Act, 2000", "EU AI Act", "Constitutional law", "Legal drafting"],
  photo: "assets/portrait-law-student.webp",
  photoAlt: "A law student seen from behind, holding a book and looking toward a domed courthouse",

  // ---- Experience (only what is real; add dates/roles if you like: "Organisation | Role or note") ----
  experience: [
    "Jus Corpus | Internship",
    "Lawlicious Committee | Internship",
    "Record of Law | Internship",
    "Narendra & Narendra Associates | Internship",
    "AGISS Research Institute | Internship",
    "ACA | Internship",
    "DLSA Pune | Criminal law and legal aid"
  ],

  // ---- Projects (delete any you do not want to show) ----
  projects: [
    "Privacy Law Quest | A gamified data privacy learning platform built as an interactive web app, with quizzes, client simulations and a DPDP Rules 2025 compliance timeline.",
    "Humanitarian law seminar | Seminar material on the historical development of international humanitarian law (“Even in War, Are There Rules?”), prepared for law students and faculty."
  ],

  awards: [],                       // e.g. ["Best Memorial, XYZ Moot 2026"]. Leave empty to hide.
  beyond: ["Drawing and sketching", "Travel", "Creative branding and design"],

  // ---- Contact (the Contact section stays hidden until you add an email or a link) ----
  email: "",                        // e.g. "you@example.com"
  links: [],                        // e.g. [{ label: "LinkedIn", url: "https://www.linkedin.com/in/your-name" }]
  contactText: "I welcome conversations about research, collaboration on legal writing, and academic or professional opportunities.",
  formEndpoint: "",                 // optional: a free Formspree address, e.g. "https://formspree.io/f/xxxxxxx"

  // ---- Legal pages ----
  privacy: "This website does not use advertising or analytics cookies and does not store visitor data. If you use the contact form, your message is sent to the author’s email and used only to reply to you.",
  disclaimer: "The content on this website is published for academic and informational purposes. It reflects the author’s views as a student and is not legal advice. Please consult a qualified lawyer about any specific legal matter."
};

window.POSTS = [
  {
    slug: "why-puttaswamy-still-anchors-indian-data-privacy-law",
    title: "Why Puttaswamy Still Anchors Indian Data Privacy Law",
    type: "blog",                   // "blog", "article" or "research"
    status: "published",            // "published" or "draft"
    featured: true,                 // show on the home page
    sample: true,                   // DELETE this line once you replace the sample with your own writing
    date: "2026-10-24",
    author: "Indhu",
    categories: "Data Privacy, Constitutional Law",
    tags: "Puttaswamy, Article 21, DPDP Act",
    keywords: "right to privacy, Puttaswamy, DPDP Act 2023, proportionality",
    cover: "assets/cover-lady-justice.webp",
    coverAlt: "A bronze statue of Lady Justice holding a balance scale",
    excerpt: "Nine judges, one unanimous holding, and a three-part test that still shapes how India thinks about personal data.",
    abstract: "",
    body: `On 24 August 2017, nine judges of the Supreme Court of India unanimously held that privacy is a fundamental right. The case, *Justice K.S. Puttaswamy (Retd.) v. Union of India*, began as a challenge to Aadhaar, but the Court first had to answer a more basic question: does the Constitution protect privacy at all?

Years later, every conversation about data protection in India still starts from that answer.

## What the Court decided

The nine-judge bench held that the right to privacy is intrinsic to life and personal liberty under Article 21 and forms part of the freedoms guaranteed in Part III of the Constitution. In doing so, it overruled *M.P. Sharma* and *Kharak Singh* to the extent that those decisions had denied a fundamental right to privacy.

The Court was equally clear that the right is not absolute. That sentence matters more than it first appears, because it turns a declaration into a framework.

## The test that outlasts the case

An interference with privacy must satisfy three requirements:

1. **Legality.** There must be a law that authorises it.
2. **Legitimate aim.** The law must pursue a legitimate objective of the State.
3. **Proportionality.** The means chosen must be proportionate to that aim.

This is why *Puttaswamy* is more than a statement of principle. It gives courts, and students like me, a way to ask whether a particular data practice is justified, rather than only whether privacy matters.

## From principle to statute

Parliament enacted the Digital Personal Data Protection Act, 2023 on 11 August 2023. It sets out a consent-based framework for processing digital personal data, speaks of the individual as a *Data Principal* and the organisation as a *Data Fiduciary*, and provides for a Data Protection Board. The DPDP Rules, 2025 were notified in November 2025 with a phased timeline for compliance.

Two features of the Act stand out when read alongside *Puttaswamy*. It applies only to personal data in digital form. And it contains exemptions, including for certain State instrumentalities, that deserve careful scrutiny.

## Questions I am still thinking about

- Can broad exemptions for the State be reconciled with the proportionality requirement?
- How should consent work in practice when notices are long and choices are binary?
- What will "legitimate aim" mean for newer areas such as automated decision-making?

I do not have settled answers, and that is the reason for writing this down. Corrections and comments are welcome.

> This is a sample post written to show how a blog looks on this site. Replace it with your own writing before sharing the site, and check every legal reference against the primary source.`,
    references: `*Justice K.S. Puttaswamy (Retd.) v. Union of India*, (2017) 10 SCC 1 (Supreme Court of India, 24 August 2017).
Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023).
Digital Personal Data Protection Rules, 2025 (notified November 2025). Check the Ministry of Electronics and Information Technology website for the official text and commencement dates.`
  }

  /* To add more posts, copy the block above (from { to },), paste it here, and edit it.
     Available covers: assets/cover-books-and-glasses.webp, assets/cover-courthouse.webp,
     assets/cover-lady-justice.webp, assets/cover-documents-and-pen.webp
     For research papers also add:  rstatus: "unpublished" | "working" | "preprint" | "submitted" | "published",
     journal: "", doi: "", pdf: "assets/your-paper.pdf", coauthors: "".  */
];
