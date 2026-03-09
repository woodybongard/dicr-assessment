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
  // START
  'start': {
    id: 'start',
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
