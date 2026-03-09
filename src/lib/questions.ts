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
  // PLACING DENTAL IMPLANTS TRACK
  // ============================================
  'placing-start': {
    id: 'placing-start',
    type: 'question',
    text: 'Do you currently place dental implants?',
    options: [
      { label: 'Yes', nextId: 'placing-specialist' },
      { label: 'No, I would like to', nextId: 'wants-to-place-specialist' },
    ],
  },

  // ============================================
  // BRANCH A: Currently places implants
  // ============================================

  'placing-specialist': {
    id: 'placing-specialist',
    type: 'question',
    text: 'Are you a dental specialist?',
    options: [
      { label: 'Yes', nextId: 'specialist-has-ce' },
      { label: 'No', nextId: 'gd-complex-cases' },
    ],
  },

  // Specialist path
  'specialist-has-ce': {
    id: 'specialist-has-ce',
    type: 'question',
    text: 'Do you have the required implant CE for this year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
    infoLink: {
      label: 'Information',
      url: '#',
      description: 'Requirement: Maintain 3 hours of implant dentistry CE per year',
    },
  },

  // General Dentist path - currently placing
  'gd-complex-cases': {
    id: 'gd-complex-cases',
    type: 'question',
    text: 'Do you perform complex cases?',
    options: [
      { label: 'Yes', nextId: 'gd-surgical-proficiency' },
      { label: 'No (Simple cases)', nextId: 'simple-documentation' },
    ],
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  // Complex cases path
  'gd-surgical-proficiency': {
    id: 'gd-surgical-proficiency',
    type: 'question',
    text: 'Do you have a high level of dentoalveolar surgical proficiency?',
    options: [
      { label: 'Yes', nextId: 'gd-training-documentation' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
  },

  'gd-training-documentation': {
    id: 'gd-training-documentation',
    type: 'question',
    text: 'Do you have documentation of training and/or experience?',
    options: [
      { label: 'Yes', nextId: 'gd-complex-experience' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
  },

  'gd-complex-experience': {
    id: 'gd-complex-experience',
    type: 'question',
    text: 'Do you have training/experience in complex cases?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'gd-courses-hours-documentation' },
    ],
  },

  'gd-courses-hours-documentation': {
    id: 'gd-courses-hours-documentation',
    type: 'question',
    text: 'Do you have documentation of courses/hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
  },

  // Simple cases path
  'simple-documentation': {
    id: 'simple-documentation',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
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
      { label: 'Yes', nextId: 'specialist-maintained-ce' },
      { label: 'No', nextId: 'gd-needs-surgical-training' },
    ],
  },

  // Specialist who wants to place
  'specialist-maintained-ce': {
    id: 'specialist-maintained-ce',
    type: 'question',
    text: 'Have you maintained 3 hours of implant dentistry CE per year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
  },

  // General Dentist who wants to place
  'gd-needs-surgical-training': {
    id: 'gd-needs-surgical-training',
    type: 'question',
    text: 'Do you need implant surgical training?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
  },

  // ============================================
  // RESTORING IMPLANT CASES TRACK
  // ============================================

  // START of Restoring track
  'restore-start': {
    id: 'restore-start',
    type: 'question',
    text: 'Do you currently restore implant cases?',
    options: [
      { label: 'Yes', nextId: 'restore-specialist' },
      { label: 'No, I would like to', nextId: 'restore-wants-to-specialist' },
    ],
  },

  // ============================================
  // RESTORE BRANCH A: Currently restores implants
  // ============================================

  'restore-specialist': {
    id: 'restore-specialist',
    type: 'question',
    text: 'Are you a dental specialist?',
    options: [
      { label: 'Yes', nextId: 'restore-specialist-has-ce' },
      { label: 'No', nextId: 'restore-gd-complex-cases' },
    ],
  },

  // Specialist path (restore)
  'restore-specialist-has-ce': {
    id: 'restore-specialist-has-ce',
    type: 'question',
    text: 'Do you have the required implant CE for this year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
    infoLink: {
      label: 'Information',
      url: '#',
      description: 'Requirement: Maintain 3 hours of implant dentistry CE per year',
    },
  },

  // General Dentist path - currently restoring
  'restore-gd-complex-cases': {
    id: 'restore-gd-complex-cases',
    type: 'question',
    text: 'Do you perform complex cases?',
    options: [
      { label: 'Yes', nextId: 'restore-gd-prosth-proficiency' },
      { label: 'No (Simple cases)', nextId: 'restore-simple-documentation' },
    ],
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
  },

  // Complex cases path (restore)
  'restore-gd-prosth-proficiency': {
    id: 'restore-gd-prosth-proficiency',
    type: 'question',
    text: 'Do you have a high level of prosthodontic proficiency?',
    options: [
      { label: 'Yes', nextId: 'restore-gd-training-documentation' },
      { label: 'No', nextId: 'endpoint-courses' },
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
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
    ],
  },

  // Simple cases path (restore)
  'restore-simple-documentation': {
    id: 'restore-simple-documentation',
    type: 'question',
    text: 'Do you have documentation of your courses and hours?',
    options: [
      { label: 'Yes', nextId: 'endpoint-open-account' },
      { label: 'No', nextId: 'endpoint-courses' },
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
      { label: 'Yes', nextId: 'restore-specialist-maintained-ce' },
      { label: 'No', nextId: 'restore-gd-needs-prosth-training' },
    ],
  },

  // Specialist who wants to restore
  'restore-specialist-maintained-ce': {
    id: 'restore-specialist-maintained-ce',
    type: 'question',
    text: 'Have you maintained 3 hours of implant dentistry CE per year?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
  },

  // General Dentist who wants to restore
  'restore-gd-needs-prosth-training': {
    id: 'restore-gd-needs-prosth-training',
    type: 'question',
    text: 'Do you need implant prosthetics training?',
    options: [
      { label: 'Yes', nextId: 'endpoint-courses' },
      { label: 'No', nextId: 'endpoint-open-account' },
    ],
    guidelineLink: {
      label: 'View RCDSO Implant Guidelines',
      url: 'https://www.rcdso.org/standards-guidelines-resources/standards-guidelines-advisories/faqsearchresults?query=implants&faqIDs=16513',
    },
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
