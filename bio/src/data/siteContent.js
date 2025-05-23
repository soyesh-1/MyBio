// IMPORTANT: Replace placeholder values with your actual information!
export const siteOwnerGlobal = "Soyesh Shrestha"; // <<< CHANGE THIS

export const navbarContent = {
    brandName: siteOwnerGlobal,
    links: [
        { id: "home", text: "Home", href: "#home" },
        { id: "about", text: "About", href: "#about" },
        { id: "projects", text: "Projects", href: "#projects" },
        { id: "blog", text: "Blog", href: "#blog" },
        { id: "contact", text: "Contact", href: "#contact" },
    ]
};

export const heroContent = {
    greeting: "Hi, I'm",
    name: siteOwnerGlobal,
    tagline: "Software Engineer | Creative Developer | Lifelong Learner", // <<< CHANGE THIS
    description: "I craft elegant and efficient solutions for complex digital problems. Passionate about building intuitive user experiences and exploring new technologies.", // <<< CHANGE THIS
    // Example for Vite if image is in `src/assets/images/your-headshot.png`:
    // import headshotImage from '../assets/images/your-headshot.png'; // Add this line at the top of THIS file
    // imageUrl: headshotImage, // Then use the imported variable here
    imageUrl: "https://placehold.co/400x400/111827/FFFFFF?text=Your+Headshot", // <<< REPLACE THIS (see comment above)
    ctaPrimary: { text: "View My Work", href: "#projects" },
    ctaSecondary: { text: "Get In Touch", href: "#contact" },
};

export const aboutContent = {
    title: "About Me",
    description: "This is where you'll share your story, your journey into your field, your passions, values, and what makes you unique. Talk about your approach to work and what drives you. You can also mention some key experiences or philosophies here.\n\nMake it engaging and authentic!" // <<< CHANGE THIS
};

export const projectsContent = {
    title: "My Projects",
    items: [
        {
            id: 1,
            title: "Project Alpha", // <<< CHANGE THIS
            description: "A brief description of Project Alpha, highlighting its key features, the technologies used, and the problem it solves.", // <<< CHANGE THIS
            imageUrl: "https://placehold.co/600x400/FFFFFF/111827?text=Project+Alpha", // <<< REPLACE THIS (import image or use public path)
            tags: ["React", "Node.js", "Tailwind CSS"], // <<< CHANGE THIS
            liveLink: "#", // <<< CHANGE THIS
            githubLink: "#", // <<< CHANGE THIS
        },
        {
            id: 2,
            title: "Project Beta", // <<< CHANGE THIS
            description: "An innovative web application that streamlines task management for small teams, featuring real-time collaboration.", // <<< CHANGE THIS
            imageUrl: "https://placehold.co/600x400/F3F4F6/1F2937?text=Project+Beta", // <<< REPLACE THIS
            tags: ["Vue.js", "Firebase", "SCSS"], // <<< CHANGE THIS
            liveLink: "#", // <<< CHANGE THIS
            githubLink: "#", // <<< CHANGE THIS
        },
        // Add more projects as needed
    ]
};

export const contactContent = {
    title: "Get In Touch",
    pitch: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of something amazing. Feel free to reach out!", // <<< CHANGE THIS
    email: `soyeshxrestha@gmail.com`, // <<< CHANGE THIS
    socialLinks: [
        {
            name: "Discord",
            href: "https://github.com/yourusername", // <<< REPLACE with your GitHub URL
            label: "My Discord Profile",
            iconKey: "discord" // We'll use this to pick the icon
        },
        {
            name: "LinkedIn",
            href: "https://linkedin.com/in/yourprofile", // <<< REPLACE with your LinkedIn URL
            label: "My LinkedIn Profile",
            iconKey: "linkedin"
        },
        {
            name: "Instagram",
            href: "https://instagram.com/yourusername", // <<< REPLACE with your Instagram URL
            label: "My Instagram Profile",
            iconKey: "instagram"
        },
        {
            name: "Facebook",
            href: "https://facebook.com/yourprofile", // <<< REPLACE with your Facebook URL
            label: "My Facebook Profile",
            iconKey: "facebook"
        }
        // Add more here if you like, e.g., Twitter, Dribbble, etc.
        // { name: "Twitter", href: "#", label: "My Twitter Profile", iconKey: "twitter" },
    ]
};

export const footerContent = {
    copyrightName: siteOwnerGlobal,
};