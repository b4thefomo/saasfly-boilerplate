---
title: Installation Guide
description: How to install and set up SaasFly
date: 2025-04-11
---

# Installation Guide

This guide will walk you through the process of installing and setting up SaasFly for your project.

## Requirements

Before you begin, make sure you have the following installed:

- Node.js (v18 or newer)
- npm or bun package manager
- Git

## Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/your-username/saasfly.git
cd saasfly
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saasfly"

# Authentication
AUTH_SECRET="your-secret-key"

# Stripe (optional)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

4. Run the development server:

```bash
bun dev
```

Your SaasFly application should now be running at http://localhost:3000.

## Next Steps

After completing the installation, you may want to:

- Configure your database
- Set up user roles and permissions
- Customize the theme and branding
- Add your own content

Refer to the other documentation sections for more details on these topics.
