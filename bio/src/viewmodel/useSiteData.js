import {
    navbarContent as nc,
    heroContent as hc,
    aboutContent as ac,
    projectsContent as pc,
    contactContent as cc,
    footerContent as fc
} from '../data/siteContent';

export const useSiteData = () => {
    return {
        navbarContent: nc,
        heroContent: hc,
        aboutContent: ac,
        projectsContent: pc,
        contactContent: cc,
        footerContent: fc,
    };
};