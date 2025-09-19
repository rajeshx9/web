// Redirect to the pure HTML version
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the HTML version in the public folder
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Redirecting to AlumniConnect...</h1>
        <p className="text-xl text-muted-foreground">If you're not redirected, <a href="/index.html" className="text-blue-500 underline">click here</a></p>
      </div>
    </div>
  );
};

export default Index;
