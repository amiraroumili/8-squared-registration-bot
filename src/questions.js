export const questions = [
  {
    id: 'first_name',
    question: 'What is your First Name?',
    type: 'text',
    placeholder: 'Type your first name here...'
  },
  {
    id: 'last_name',
    question: 'What is your Last Name?',
    type: 'text',
    placeholder: 'Type your last name here...'
  },
  {
    id: 'email',
    question: 'What is your email address?',
    type: 'text',
    placeholder: 'example@email.com'
  },
  {
    id: 'experience',
    question: 'What is your chess experience level?',
    type: 'mcq',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  {
    id: 'age_group',
    question: 'Which age group do you belong to?',
    type: 'mcq',
    options: ['Under 18', '18-25', '26-40', '41-60', '60+']
  },
  {
    id: 'availability',
    question: 'Which days are you available for club meetings?',
    type: 'multiple_choice',
    options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: 'interests',
    question: 'What interests you most about joining?',
    type: 'text',
    placeholder: 'Tell us what excites you...'
  }
];
