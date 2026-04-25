import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl">
        <Card>
          <div className="text-sm font-semibold text-white">404</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-white">Page not found</div>
          <p className="mt-3 text-sm text-slate-300">
            That route doesn’t exist. Head back home and shorten a link.
          </p>
          <div className="mt-5">
            <Link to="/">
              <Button>Go to home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}

