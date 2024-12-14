# Flappy Seal

A fun and engaging web-based game featuring a seal as the main character, built with React, TypeScript, and Supabase.

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run `npm run dev` to start the development server

## Security

This project uses environment variables to protect sensitive data. Make sure to:

1. Never commit the `.env` file
2. Keep your Supabase credentials secure
3. Use environment variables for all sensitive data
4. Follow security best practices when deploying

## Database Setup

The database schema and security policies are managed through Supabase migrations. See the `supabase/migrations` directory for details.

## Features

- User authentication
- Persistent high scores
- Weekly leaderboard reset
- Responsive design
- Touch and keyboard controls

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.