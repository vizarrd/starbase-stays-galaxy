interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className={`death-star-loader ${sizeClasses[size]}`} />
      <p className="text-muted-foreground font-exo text-center animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;