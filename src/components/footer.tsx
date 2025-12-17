const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 text-center border-t border-slate-200/50 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
          &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
          <span className="hidden sm:inline"> • </span> 
          <br className="sm:hidden" /> 
          มหาวิทยาลัยราชภัฏเชียงใหม่
        </p>
      </div>
    </footer>
  );
};

export default Footer;