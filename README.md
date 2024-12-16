# Flappy Seal

A fun and engaging web-based game featuring a seal as the main character, built with React, TypeScript, and Supabase.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Note: In development mode, the app will work without credentials, but authentication
   and data persistence will be mocked.

4. Start the development server:
   ```bash
   npm run dev
   ```

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