// Decision tree data structure

export type QuestionNode = {
  id: string;
  type: 'question';
  text: string;
  options: {
    label: string;
    nextId: string;
  }[];
  guidelineLink?: {
    label: string;
    url: string;
  };
  infoLink?: {
    label: string;
    url: string;
    description?: string;
  };
};

export type EndpointNode = {
  id: string;
  type: 'endpoint';
  title: string;
  description: string;
  action: {
    label: string;
    url: string;
    type: 'ce-courses' | 'open-account';
  };
};

export type FlowNode = QuestionNode | EndpointNode;

export const flowData: Record<string, FlowNode> = {
  // ============================================
  // TRACK SELECTION
  // ============================================
  'start': {
    id: 'start',
    type: 'question',
    text: 'Which track would you like to take?',
    options: [
      { label: 'Placing Dental Implants', nextId: 'placing-start' },
      { label: 'Restoring Implant Cases', nextId: 'restore-start' },
    ],
  },

  // ============================================
  // PLACING DENTAL IMPLANTS TRACK (Surgical Arm)
  // ============================================
  'placing-start': {
    id: 'placing-start',
    type: 'question',
    text: 'Do you currently place dental implants?',
    options: [
      { label: 'Yes, and I am aware of evaluation, case selection and treatment planning criteria', nextId: 'placing-specialist' },
      { label: 'No, I would like to', nextId: 'wants-to-place-specialist' },
    ],
    infoLink: {
      label: 'Surgical Arm — Evaluation Criteria',
      url: '#',
      description: 'Dentists must: (a) determine the patient\'s suitability for surgical treatment based on the prosthetic prescription; (b) identify any need for additional records, imaging, or investigations; (c) determine the details of surgical intervention; (d) discuss concerns that may require modification of the prosthetic prescription with the treating dentist; and (e) determine the patient\'s medical status, scope of surgical treatment, and patient preference when recommending sedation or general anaesthesia.',
    },
  },

  // ============================================
  // BRANCH A: Currently places implants
  // ============================================

  'placing-specialist': {
    id: 'placing-specialist',
    type: 'question',
    text: 'Are you a dental specialist?',
    options: [
      { label: 'Yes', nextId: 'placing-specialist-ce' },
      { label: 'No, I am a general dentist', nextId: 'placing-gd-case-type' },
    ],
    infoLink: {
      label: 'Who qualifies as a specialist?',
      url: '#',
      description: 'Registered specialists in oral and maxillofacial surgery, periodontics, and prosthodontics who have received comprehensive training to perform dental implant treatment as part of an accredited postgraduate specialty training program.',
    },
  },

  // Specialist path — "I am a Dental Specialist and need my CE hours for this year"
  'placing-specialist-ce': {
    id: 'placing-specialist-ce',
    type: 'question',
    text: 'Do you have the required continuing education (CE) for this year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'CE Requirement',
      url: '#',
      description: 'Requirement: Maintain 3 hours of implant dentistry CE per year.',
    },
  },

  // General Dentist path — complex vs simple
  'placing-gd-case-type': {
    id: 'placing-gd-case-type',
    type: 'question',
    text: 'What type of cases are you involved in?',
    options: [
      { label: 'Complex cases', nextId: 'placing-gd-surgical-proficiency' },
      { label: 'Simple/straightforward cases', nextId: 'placing-simple-documentation' },
    ],
    infoLink: {
      label: 'Complex vs. Simple Cases',
      url: '#',
      description: 'Complex cases involve advanced surgical procedures such as bone grafting, sinus lifts, immediate placement, or cases with significant anatomical risks. Simple/straightforward cases involve standard implant placement in adequate bone with minimal risk factors. Before beginning training for complex cases, dentists must have competence and experience in straightforward placement.',
    },
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  // Complex cases — surgical proficiency
  'placing-gd-surgical-proficiency': {
    id: 'placing-gd-surgical-proficiency',
    type: 'question',
    text: 'Do you have a high level of dentoalveolar surgical proficiency?',
    options: [
      { label: 'Yes', nextId: 'placing-gd-training-documentation' },
      { label: 'No, I would like to gain further education/training', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'What is dentoalveolar surgical proficiency?',
      url: '#',
      description: 'A high level of dentoalveolar surgical proficiency is generally defined as the ability to independently and efficiently perform complex surgical procedures — including complicated dental extractions, pre-prosthetic surgery, and bone grafting — while managing complications and mitigating risks. This level of proficiency is marked by both technical skill and sound clinical judgment.',
    },
  },

  'placing-gd-training-documentation': {
    id: 'placing-gd-training-documentation',
    type: 'question',
    text: 'Do you have documentation of training and/or experience?',
    options: [
      { label: 'Yes', nextId: 'placing-gd-complex-experience' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
  },

  'placing-gd-complex-experience': {
    id: 'placing-gd-complex-experience',
    type: 'question',
    text: 'Do you have training/experience in complex cases?',
    options: [
      { label: 'Yes, I have documentation to show that I have training and/or experience', nextId: 'endpoint-open-account' },
      { label: 'No, I need training and/or mentorship', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'Complex Case Prerequisite',
      url: '#',
      description: 'Before beginning training for complex placements of dental implants, dentists must have competence and experience in the straightforward placement of dental implant(s).',
    },
  },

  // Simple cases path — documentation
  'placing-simple-documentation': {
    id: 'placing-simple-documentation',
    type: 'question',
    text: 'Do you have your surgical training hours?',
    options: [
      { label: 'Yes', nextId: 'placing-simple-keep-docs' },
      { label: 'No, I need surgical training', nextId: 'endpoint-courses' },
    ],
  },

  'placing-simple-keep-docs': {
    id: 'placing-simple-keep-docs',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No, I need to document them', nextId: 'endpoint-open-account' },
    ],
  },

  // ============================================
  // BRANCH B: Wants to place implants
  // ============================================

  'wants-to-place-specialist': {
    id: 'wants-to-place-specialist',
    type: 'question',
    text: 'Are you a specialist?',
    options: [
      { label: 'Yes', nextId: 'wants-to-place-specialist-ce' },
      { label: 'No, I am a general dentist and I need implant surgical training', nextId: 'gd-needs-surgical-training' },
    ],
    infoLink: {
      label: 'Who qualifies as a specialist?',
      url: '#',
      description: 'Registered specialists in oral and maxillofacial surgery, periodontics, and prosthodontics who have received comprehensive training to perform dental implant treatment as part of an accredited postgraduate specialty training program.',
    },
  },

  // Specialist who wants to place — CE maintenance
  'wants-to-place-specialist-ce': {
    id: 'wants-to-place-specialist-ce',
    type: 'question',
    text: 'Do you maintain 3 hours of implant dentistry CE per year?',
    options: [
      { label: 'I need CE hours', nextId: 'endpoint-courses' },
      { label: 'I have CE hours I need to document', nextId: 'endpoint-open-account' },
    ],
  },

  // General Dentist who wants to place
  'gd-needs-surgical-training': {
    id: 'gd-needs-surgical-training',
    type: 'question',
    text: 'Do you need implant surgical training?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No, I have my surgical training hours', nextId: 'gd-surgical-keep-docs' },
    ],
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  'gd-surgical-keep-docs': {
    id: 'gd-surgical-keep-docs',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No, I need to document them', nextId: 'endpoint-open-account' },
    ],
  },

  // ============================================
  // RESTORING IMPLANT CASES TRACK (Prosthetic Arm)
  // ============================================

  'restore-start': {
    id: 'restore-start',
    type: 'question',
    text: 'Do you currently restore implant cases?',
    options: [
      { label: 'Yes, and I am aware of evaluation, case selection and treatment planning criteria', nextId: 'restore-specialist' },
      { label: 'No, I would like to', nextId: 'restore-wants-to-specialist' },
    ],
    infoLink: {
      label: 'Prosthetic Arm — Evaluation Criteria',
      url: '#',
      description: 'Dentists must evaluate the patient to determine the appropriateness of the case for implant treatment. The evaluation must include: (1) the patient\'s primary concerns and expectations; (2) a complete dental history; (3) a complete medical history; (4) a clinical extra-/intra-oral examination; (5) oral hygiene status; (6) appropriate imaging of the proposed site(s); (7) diagnostic records to identify oral pathologies, periodontal condition, occlusion, parafunction, bone volume and quality, implant number and location, risk factors for failure, need for additional intervention, and vital structures/anatomical risks. Must also include financial costs from potential complications and long-term maintenance.',
    },
  },

  // ============================================
  // RESTORE BRANCH A: Currently restores implants
  // ============================================

  'restore-specialist': {
    id: 'restore-specialist',
    type: 'question',
    text: 'Are you a dental specialist?',
    options: [
      { label: 'Yes', nextId: 'restore-specialist-ce' },
      { label: 'No, I am a general dentist', nextId: 'restore-gd-case-type' },
    ],
    infoLink: {
      label: 'Who qualifies as a specialist?',
      url: '#',
      description: 'Registered specialists in oral and maxillofacial surgery, periodontics, and prosthodontics who have received comprehensive training to perform dental implant treatment as part of an accredited postgraduate specialty training program.',
    },
  },

  // Specialist path (restore) — CE check
  'restore-specialist-ce': {
    id: 'restore-specialist-ce',
    type: 'question',
    text: 'Do you have the required continuing education (CE) for this year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'CE Requirement',
      url: '#',
      description: 'Requirement: Maintain 3 hours of implant dentistry CE per year.',
    },
  },

  // General Dentist path — complex vs simple (restore)
  'restore-gd-case-type': {
    id: 'restore-gd-case-type',
    type: 'question',
    text: 'What type of cases are you involved in?',
    options: [
      { label: 'Complex cases', nextId: 'restore-gd-prosth-proficiency' },
      { label: 'Simple/straightforward cases', nextId: 'restore-simple-documentation' },
    ],
    infoLink: {
      label: 'Complex vs. Simple Cases',
      url: '#',
      description: 'Complex cases involve advanced prosthetic procedures such as full-arch restorations, cases requiring extensive occlusal rehabilitation, or those with significant aesthetic demands. Simple/straightforward cases involve standard implant-supported restorations with minimal complexity. Before beginning training for complex restorations, dentists must have competence and experience in straightforward restoration of dental implants.',
    },
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  // Complex cases — prosthodontic proficiency
  'restore-gd-prosth-proficiency': {
    id: 'restore-gd-prosth-proficiency',
    type: 'question',
    text: 'Do you have a high level of prosthodontic proficiency?',
    options: [
      { label: 'Yes', nextId: 'restore-gd-training-documentation' },
      { label: 'No, I would like to gain further education/training', nextId: 'endpoint-courses' },
    ],
  },

  'restore-gd-training-documentation': {
    id: 'restore-gd-training-documentation',
    type: 'question',
    text: 'Do you have documentation of training and/or experience?',
    options: [
      { label: 'Yes', nextId: 'restore-gd-complex-experience' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
  },

  'restore-gd-complex-experience': {
    id: 'restore-gd-complex-experience',
    type: 'question',
    text: 'Do you have training/experience in complex cases?',
    options: [
      { label: 'Yes, I have documentation to show that I have training and/or experience', nextId: 'endpoint-open-account' },
      { label: 'No, I need training and/or mentorship', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'Complex Case Prerequisite',
      url: '#',
      description: 'Before beginning training for complex restorations of dental implants, dentists must have competence and experience in the straightforward restoration of dental implant(s).',
    },
  },

  // Simple cases path (restore) — documentation
  'restore-simple-documentation': {
    id: 'restore-simple-documentation',
    type: 'question',
    text: 'Do you have your prosthetic training hours?',
    options: [
      { label: 'Yes', nextId: 'restore-simple-keep-docs' },
      { label: 'No, I need prosthetic training', nextId: 'endpoint-courses' },
    ],
  },

  'restore-simple-keep-docs': {
    id: 'restore-simple-keep-docs',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No, I need to document them', nextId: 'endpoint-open-account' },
    ],
  },

  // ============================================
  // RESTORE BRANCH B: Wants to restore implants
  // ============================================

  'restore-wants-to-specialist': {
    id: 'restore-wants-to-specialist',
    type: 'question',
    text: 'Are you a specialist?',
    options: [
      { label: 'Yes', nextId: 'restore-wants-specialist-ce' },
      { label: 'No, I am a general dentist and I need implant prosthetics training', nextId: 'restore-gd-needs-prosth-training' },
    ],
    infoLink: {
      label: 'Who qualifies as a specialist?',
      url: '#',
      description: 'Registered specialists in oral and maxillofacial surgery, periodontics, and prosthodontics who have received comprehensive training to perform dental implant treatment as part of an accredited postgraduate specialty training program.',
    },
  },

  // Specialist who wants to restore — CE maintenance
  'restore-wants-specialist-ce': {
    id: 'restore-wants-specialist-ce',
    type: 'question',
    text: 'Do you maintain 3 hours of implant dentistry CE per year?',
    options: [
      { label: 'I need CE hours', nextId: 'endpoint-courses' },
      { label: 'I have CE hours I need to document', nextId: 'endpoint-open-account' },
    ],
  },

  // General Dentist who wants to restore
  'restore-gd-needs-prosth-training': {
    id: 'restore-gd-needs-prosth-training',
    type: 'question',
    text: 'Do you need implant prosthetics training?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No, I have my prosthetic training hours', nextId: 'restore-gd-prosth-keep-docs' },
    ],
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  'restore-gd-prosth-keep-docs': {
    id: 'restore-gd-prosth-keep-docs',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No, I need to document them', nextId: 'endpoint-open-account' },
    ],
  },

  // ============================================
  // ENDPOINTS
  // ============================================

  'endpoint-courses': {
    id: 'endpoint-courses',
    type: 'endpoint',
    title: 'DICR CE Courses',
    description: 'Based on your responses, we recommend exploring our Continuing Education courses to build or enhance your implant dentistry skills.',
    action: {
      label: 'Browse CE Courses',
      url: '#ce-courses',
      type: 'ce-courses',
    },
  },

  'endpoint-open-account': {
    id: 'endpoint-open-account',
    type: 'endpoint',
    title: 'Open a DICR Account',
    description: 'Great! You have the qualifications needed. Open a DICR account to register your credentials and showcase your implant dentistry competency.',
    action: {
      label: 'Open an Account',
      url: '#open-account',
      type: 'open-account',
    },
  },
};

export const START_NODE_ID = 'start';
