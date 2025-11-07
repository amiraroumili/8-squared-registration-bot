export const questions = [
  // 🧍 Personal Information
  {
    id: 'first_name',
    question: 'What is your first name?',
    type: 'text',
    placeholder: 'Type your first name here...',
    required: true,
    validation: (value) => value.trim().length > 0 ? null : 'First name is required'
  },
  {
    id: 'last_name',
    question: 'What is your last name?',
    type: 'text',
    placeholder: 'Type your last name here...',
    required: true,
    validation: (value) => value.trim().length > 0 ? null : 'Last name is required'
  },
  {
    id: 'email',
    question: 'What is your email address?',
    type: 'text',
    placeholder: 'example@email.com',
    required: true,
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Email is required';
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return null;
    }
  },
  {
    id: 'phone_number',
    question: 'What is your phone number?',
    type: 'text',
    placeholder: 'e.g., +213 555 123 456',
    required: false,
    skippable: true,
    validation: (value) => {
      if (!value || value.trim() === '') return null; // Allow empty for optional
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 8) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  {
    id: 'school',
    question: 'Which school or institution do you attend?',
    type: 'mcq',
    options: ['NHSM', 'ENSIA', 'NHSCS', 'NHSAST', 'ENSNN', 'Other'],
    required: true
  },
  {
    id: 'school_other',
    question: 'Please specify your School or Institution',
    type: 'text',
    placeholder: 'Type your school name here...',
    required: true,
    conditionalOn: { field: 'school', value: 'Other' },
    validation: (value) => value.trim().length > 0 ? null : 'Please specify your school'
  },

  // 💡 Skills & Interests
  {
    id: 'skills',
    question: 'Which of these skills do you have or would like to develop? (Select all that apply)',
    type: 'multiple_choice',
    options: [
      'Video Editing',
      'Photography',
      'Communication / Public Speaking',
      'Graphic Design',
      'Event Management',
      'Coaching or Teaching',
      'Social Media Management',
      'Other'
    ],
    required: true
  },
  {
    id: 'skills_other',
    question: 'Please specify other skills',
    type: 'text',
    placeholder: 'Type your other skills here...',
    required: true,
    conditionalOn: { field: 'skills', valueIncludes: 'Other' },
    validation: (value) => value.trim().length > 0 ? null : 'Please specify your other skills'
  },
  {
    id: 'help_interest',
    question: 'Would you be interested in helping with tournaments or teaching beginners?',
    type: 'mcq',
    options: [
      'Yes, I\'d love to help organize tournaments',
      'Yes, I\'d love to teach or mentor beginners',
      'Maybe later',
      'Not right now'
    ],
    required: true
  },

  // 🎯 Motivation & Experience
  {
    id: 'motivation',
    question: 'What inspired you to join 8-Squared Chess Club?',
    type: 'text',
    placeholder: 'Tell us briefly what drew you to our club or chess in general...',
    required: true,
    validation: (value) => value.trim().length > 0 ? null : 'Please share what inspired you to join'
  },
  {
    id: 'chess_level',
    question: 'What is your Chess Level?',
    type: 'mcq',
    options: [
      'New to the Game',
      'Beginner',
      'Intermediate',
      'Advanced',
      'Expert',
      'Master / Competitive Player'
    ],
    required: true
  },
  {
    id: 'chess_username',
    question: 'What is your Chess.com username?',
    type: 'text',
    placeholder: 'Your Chess.com username...',
    required: false,
    skippable: true
  },
  {
    id: 'online_elo',
    question: 'Share your online ELO ratings (Chess.com, Lichess, etc.)',
    type: 'text',
    placeholder: 'e.g., Chess.com: 1500, Lichess: 1600...',
    required: false,
    skippable: true
  },
  {
    id: 'fide_rating',
    question: 'Share your FIDE rating (if applicable)',
    type: 'text',
    placeholder: 'e.g., 1800, or leave blank if not rated...',
    required: false,
    skippable: true,
    validation: (value) => {
      if (!value || value.trim() === '') return null; // Allow empty for optional
      const fideValue = parseInt(value.trim());
      if (isNaN(fideValue) || fideValue < 0 || fideValue > 3500) {
        return 'Please enter a valid FIDE rating (0-3500)';
      }
      return null;
    }
  },
  {
    id: 'official_tournaments',
    question: 'Have you ever participated in official tournaments?',
    type: 'mcq',
    options: ['Yes', 'No'],
    required: true
  },
  {
    id: 'tournament_names',
    question: 'Please mention which tournaments you participated in',
    type: 'text',
    placeholder: 'e.g., National Chess Championship 2024, Regional Tournaments...',
    required: true,
    conditionalOn: { field: 'official_tournaments', value: 'Yes' },
    validation: (value) => value.trim().length > 0 ? null : 'Please mention the tournaments you participated in'
  },

  // ♟️ Chess Personality
  {
    id: 'favorite_piece',
    question: 'What\'s your favorite chess piece — and why?',
    type: 'text',
    placeholder: 'Example: "The Knight, because I like surprising my opponent!"',
    required: false,
    skippable: true
  },

  // 🕐 Availability
  {
    id: 'availability',
    question: 'When are you usually available to participate in club activities? (Select all that apply)',
    type: 'multiple_choice',
    options: [
      'Weekdays (after school)',
      'Weekends',
      'Evenings only',
      'Online events',
      'Flexible / depends on the week'
    ],
    required: true
  },

  // 💭 Feedback & Suggestions
  {
    id: 'feedback',
    question: 'Do you have any suggestions, ideas, or expectations for 8-Squared?',
    type: 'text',
    placeholder: 'We value your opinion!',
    required: false,
    skippable: true
  }
];
