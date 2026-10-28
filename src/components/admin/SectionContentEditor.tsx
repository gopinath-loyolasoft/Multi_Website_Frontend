import React, { useState, useMemo } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  Sliders,
  AlignLeft,
  ListPlus,
} from 'lucide-react';
import { FileUploadInput } from '../../UI_Componentes/ui/Form/FileUploadInput';
import { IconPicker } from '../common/IconPicker';
import { PageUrlPicker } from '../common/PageUrlPicker';

export interface SelectOption {
  label: string;
  value: string;
}

export interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'image' | 'icon' | 'select' | 'url';
  options?: SelectOption[];
  help?: string;
  placeholder?: string;
}

export interface ObjectListField {
  key: string;
  label: string;
  type: 'object-list';
  itemLabel: string;
  fields: ContentField[];
}

export interface StringListField {
  key: string;
  label: string;
  type: 'string-list';
  help?: string;
  placeholder?: string;
}

export type SectionField = ContentField | ObjectListField | StringListField;

export const getFieldsForType = (sectionType: string): SectionField[] | null => {
  const norm = sectionType.toUpperCase().trim();
  switch (norm) {
    case 'HERO':
      return [
        { key: 'badge', label: 'Top Badge Tag', type: 'text', placeholder: 'e.g. Admissions 2026-27' },
        { key: 'heading', label: 'Main Headline', type: 'text', placeholder: 'e.g. Shaping Global Leaders of Tomorrow' },
        { key: 'subheading', label: 'Sub-Headline', type: 'text', placeholder: 'e.g. 60+ Accredited Degree Programs' },
        { key: 'description', label: 'Hero Narrative Description', type: 'textarea', placeholder: 'Detailed hero narrative explaining the institution...' },
        { key: 'ctaText', label: 'Primary Action Button Text', type: 'text', placeholder: 'e.g. Apply for Admissions' },
        { key: 'ctaLink', label: 'Primary Button URL / Link', type: 'text', placeholder: 'e.g. /admissions or https://...' },
        { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Book Campus Tour' },
        { key: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'text', placeholder: 'e.g. /contact' },
        { key: 'backgroundImage', label: 'Hero Background Image', type: 'image', help: 'Recommended 1920x1080 high-resolution banner photo' },
        { key: 'showRightCard', label: 'Show Floating Right Information Card', type: 'switch' },
        { key: 'cardBadge', label: 'Card Badge', type: 'text', placeholder: 'e.g. Quick Facts' },
        { key: 'cardTitle', label: 'Card Heading', type: 'text', placeholder: 'e.g. Fall Admissions Closing' },
        { key: 'cardSubtitle', label: 'Card Sub-title', type: 'text', placeholder: 'e.g. Applications reviewed on rolling basis' },
        { key: 'cardPrimaryButtonText', label: 'Card Button Text', type: 'text', placeholder: 'e.g. Start Application' },
        { key: 'cardPrimaryButtonUrl', label: 'Card Button URL', type: 'text', placeholder: 'e.g. /apply' },
        {
          key: 'cardItems',
          label: 'Card Highlight Bullets',
          type: 'object-list',
          itemLabel: 'Highlight Item',
          fields: [
            { key: 'title', label: 'Bullet Title', type: 'text', placeholder: 'e.g. 98% Placement Rate' },
            { key: 'desc', label: 'Bullet Description', type: 'text', placeholder: 'e.g. Within 6 months of graduation' },
          ],
        },
        { key: 'pillars', label: 'Quick Feature Pillars (Badges below heading)', type: 'string-list', placeholder: 'e.g. NAAC A++ Accredited' },
      ];
    case 'HERO_SLIDER':
    case 'BANNERS':
      return [
        {
          key: 'slides',
          label: 'Carousel Hero Slides',
          type: 'object-list',
          itemLabel: 'Slide',
          fields: [
            { key: 'imageUrl', label: 'Slide Image', type: 'image', help: '16:9 banner photo' },
            { key: 'headline', label: 'Slide Headline', type: 'text', placeholder: 'e.g. Excellence in Innovation' },
            { key: 'caption', label: 'Slide Caption / Subtitle', type: 'text', placeholder: 'e.g. Empowering students with cutting-edge labs' },
            { key: 'badge', label: 'Top Badge Tag', type: 'text', placeholder: 'e.g. Admissions 2026' },
            { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'e.g. Explore Programs' },
            { key: 'buttonUrl', label: 'Button Link URL', type: 'text', placeholder: 'e.g. /courses' },
          ],
        },
        { key: 'autoplaySpeed', label: 'Autoplay Speed (milliseconds)', type: 'number', help: 'Default is 6000 (6 seconds)' },
        { key: 'showArrows', label: 'Show Left / Right Navigation Arrows', type: 'switch' },
        { key: 'showDots', label: 'Show Carousel Pagination Dots', type: 'switch' },
      ];
    case 'QUOTE':
      return [
        { key: 'quoteText', label: 'Inspiring Quote Message', type: 'textarea', placeholder: 'Enter the message, vision statement, or quote from leadership...' },
        { key: 'authorName', label: 'Leader / Author Name', type: 'text', placeholder: 'e.g. Dr. Elizabeth Sterling, Ph.D.' },
        { key: 'designation', label: 'Designation / Title', type: 'text', placeholder: 'e.g. Chancellor & President' },
        { key: 'authorImageUrl', label: 'Leader Portrait Photo', type: 'image', help: 'Square portrait headshot recommended' },
        { key: 'subText', label: 'Office / Department Governance Line', type: 'text', placeholder: 'e.g. Office of Academic Affairs & Governance' },
      ];
    case 'TEXT':
      return [
        { key: 'leadText', label: 'Lead Introductory Paragraph', type: 'textarea', placeholder: 'Enter an engaging introductory or overview paragraph for this section...' },
        { key: 'bodyHtml', label: 'Body Content (Paragraphs)', type: 'textarea', placeholder: 'Enter full narrative paragraphs. HTML markup like <strong> and <ul> are supported.', help: 'Rich paragraphs describing history, mission, or institutional details' },
      ];
    case 'IMAGE':
      return [
        { key: 'imageUrl', label: 'High-Resolution Image', type: 'image', help: 'Upload or enter photo URL' },
        { key: 'caption', label: 'Photo Caption', type: 'text', placeholder: 'e.g. Main Academic Quadrangle & Innovation Atrium' },
        { key: 'altText', label: 'Image Accessibility Alt Text', type: 'text', placeholder: 'e.g. Aerial view of college campus' },
        { key: 'fullWidth', label: 'Edge-to-Edge Full Width Display', type: 'switch' },
      ];
    case 'IMAGE_TEXT':
      return [
        { key: 'badge', label: 'Category Badge Tag', type: 'text', placeholder: 'e.g. Academic Excellence' },
        { key: 'heading', label: 'Story Heading', type: 'text', placeholder: 'e.g. Empowering Tomorrow’s Innovators' },
        { key: 'description', label: 'Story Narrative', type: 'textarea', placeholder: 'Detailed narrative description explaining the topic...' },
        { key: 'imageUrl', label: 'Story Feature Image', type: 'image', help: 'High quality photo for the side column' },
        { key: 'ctaText', label: 'Call to Action Button Text', type: 'text', placeholder: 'e.g. Discover More' },
        { key: 'ctaLink', label: 'Button Link URL', type: 'text', placeholder: 'e.g. /about' },
        { key: 'points', label: 'Bullet Checklist Points', type: 'string-list', placeholder: 'e.g. Ranked in top 1% nationally for placements' },
      ];
    case 'CARDS':
      return [
        {
          key: 'items',
          label: 'Feature Cards Grid',
          type: 'object-list',
          itemLabel: 'Card',
          fields: [
            { key: 'title', label: 'Card Title', type: 'text', placeholder: 'e.g. Global Exchange Programs' },
            { key: 'desc', label: 'Card Description', type: 'textarea', placeholder: 'Explain this perk, feature, or milestone in 1-2 sentences...' },
            { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. Globe, Award, Sparkles, BookOpen, Users' },
          ],
        },
      ];
    case 'STATISTICS':
    case 'STATS':
      return [
        {
          key: 'items',
          label: 'Milestone Counters',
          type: 'object-list',
          itemLabel: 'Counter',
          fields: [
            { key: 'label', label: 'Metric Label', type: 'text', placeholder: 'e.g. Active Students' },
            { key: 'value', label: 'Counter Number', type: 'text', placeholder: 'e.g. 15,000 or 98.5' },
            { key: 'prefix', label: 'Prefix (e.g. Top or $)', type: 'text', placeholder: 'e.g. Top' },
            { key: 'suffix', label: 'Suffix (e.g. + or %)', type: 'text', placeholder: 'e.g. + or %' },
            { key: 'iconName', label: 'Icon Name', type: 'text', placeholder: 'e.g. Users, Award, BookOpen, Globe' },
          ],
        },
      ];
    case 'ICON_CARDS':
      return [
        {
          key: 'items',
          label: 'Icon Feature Highlights',
          type: 'object-list',
          itemLabel: 'Card',
          fields: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Research-First Pedagogy' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Short summary of this feature...' },
            { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. BookOpen, Award, Users' },
          ],
        },
      ];
    case 'CTA':
    case 'CALL_TO_ACTION':
      return [
        { key: 'badge', label: 'Badge Tag', type: 'text', placeholder: 'e.g. Apply Early' },
        { key: 'headline', label: 'Call to Action Headline', type: 'text', placeholder: 'e.g. Begin Your Academic Journey Today' },
        { key: 'subheadline', label: 'Supporting Description', type: 'textarea', placeholder: 'e.g. Admissions are open for all undergraduate & graduate programs...' },
        { key: 'buttonText', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Start Your Application' },
        { key: 'buttonUrl', label: 'Primary Button URL', type: 'text', placeholder: 'e.g. /admissions' },
        { key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Download Prospectus' },
        { key: 'secondaryButtonUrl', label: 'Secondary Button URL', type: 'text', placeholder: 'e.g. /brochure.pdf' },
      ];
    case 'VIDEO':
      return [
        { key: 'videoUrl', label: 'Video URL (YouTube, Vimeo, or MP4)', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...' },
        { key: 'coverImageUrl', label: 'Video Poster Cover Image', type: 'image', help: 'Thumbnail shown before the video plays' },
        { key: 'caption', label: 'Video Caption / Subtitle', type: 'text', placeholder: 'e.g. Official 2026 Campus Virtual Tour' },
      ];
    case 'FAQ':
      return [
        {
          key: 'items',
          label: 'Frequently Asked Questions',
          type: 'object-list',
          itemLabel: 'FAQ Item',
          fields: [
            { key: 'question', label: 'Question', type: 'text', placeholder: 'e.g. What are the admission deadlines?' },
            { key: 'answer', label: 'Detailed Answer', type: 'textarea', placeholder: 'Explain the answer in detail...' },
          ],
        },
      ];
    case 'LOGO_GRID':
      return [
        {
          key: 'logos',
          label: 'Partner & Recruiter Logos',
          type: 'object-list',
          itemLabel: 'Logo Item',
          fields: [
            { key: 'name', label: 'Company / Partner Name', type: 'text', placeholder: 'e.g. Google' },
            { key: 'logoUrl', label: 'Logo Image URL', type: 'image', help: 'Upload or enter SVG/PNG logo URL' },
            { key: 'url', label: 'Partner Website URL (Optional)', type: 'text', placeholder: 'https://...' },
          ],
        },
      ];
    case 'MAP':
      return [
        { key: 'embedUrl', label: 'Google Maps Embed URL (iframe src)', type: 'text', placeholder: 'https://www.google.com/maps/embed?pb=...' },
        { key: 'address', label: 'Campus Physical Address', type: 'text', placeholder: 'e.g. University Main Campus, Academic Expressway, Knowledge City - 600100' },
        { key: 'height', label: 'Map Height (px)', type: 'number', placeholder: '420' },
      ];
    case 'GALLERY':
      return [
        { key: 'limit', label: 'Max Number of Dynamic Photos to Display', type: 'number', help: 'Leave blank to use default count (e.g. 6 or 8)' },
        { key: 'showExploreButton', label: 'Show "View All Photos" Button at Bottom', type: 'switch' },
        {
          key: 'images',
          label: 'Custom Photo Gallery Images (Optional Manual Override)',
          type: 'object-list',
          itemLabel: 'Photo',
          fields: [
            { key: 'title', label: 'Photo Caption / Title', type: 'text', placeholder: 'e.g. Central Library & Research Commons' },
            { key: 'imageUrl', label: 'Photo Image URL', type: 'image', help: 'High-resolution photo' },
          ],
        },
      ];
    case 'DOCUMENTS':
    case 'DOCUMENT_DOWNLOADS':
    case 'CIRCULARS':
    case 'DOWNLOADS':
      return [
        { key: 'badge', label: 'Section Badge (Optional)', type: 'text', placeholder: 'e.g. Official Circulars & Syllabi' },
        {
          key: 'layout',
          label: 'Display Layout',
          type: 'select',
          options: [
            { label: 'List View (Recommended for official records)', value: 'list' },
            { label: 'Grid Cards (With file previews)', value: 'grid' },
          ],
        },
        { key: 'showSearch', label: 'Show Search Bar', type: 'switch' },
        { key: 'showCategories', label: 'Show Category Filter Tabs', type: 'switch' },
        {
          key: 'documents',
          label: 'Document Files & PDFs (Click to open in new tab)',
          type: 'object-list',
          itemLabel: 'Document File',
          fields: [
            { key: 'title', label: 'Document Title *', type: 'text', placeholder: 'e.g. Academic Regulation & Syllabus 2026-27' },
            { key: 'description', label: 'Description / Purpose (Optional)', type: 'textarea', placeholder: 'e.g. Detailed syllabus curriculum and evaluation scheme.' },
            { key: 'category', label: 'Category / Tag', type: 'text', placeholder: 'e.g. Syllabus, Examination, Forms, Circular' },
            { key: 'fileUrl', label: 'PDF Document File / URL *', type: 'image', help: 'Upload local PDF/DOCX file or paste link' },
            { key: 'fileType', label: 'File Format Badge', type: 'text', placeholder: 'e.g. PDF, DOCX, XLSX' },
            { key: 'fileSize', label: 'File Size (Optional)', type: 'text', placeholder: 'e.g. 2.4 MB' },
            { key: 'publishDate', label: 'Publish / Release Date (Optional)', type: 'text', placeholder: 'e.g. Sep 2026' },
          ],
        },
      ];
    case 'TABLE':
    case 'DATA_TABLE':
    case 'FEES_TABLE':
      return [
        { key: 'badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Fee Structure 2026-27' },
        { key: 'striped', label: 'Striped Row Backgrounds', type: 'switch' },
        { key: 'searchable', label: 'Enable Real-time Search Filter', type: 'switch' },
        {
          key: 'columns',
          label: 'Table Columns',
          type: 'object-list',
          itemLabel: 'Column Header',
          fields: [
            { key: 'key', label: 'Data Key (ID) *', type: 'text', placeholder: 'e.g. col1' },
            { key: 'label', label: 'Header Label *', type: 'text', placeholder: 'e.g. Program / Degree' },
            {
              key: 'align',
              label: 'Text Alignment',
              type: 'select',
              options: [
                { label: 'Left Aligned', value: 'left' },
                { label: 'Center Aligned', value: 'center' },
                { label: 'Right Aligned', value: 'right' },
              ],
            },
          ],
        },
        {
          key: 'rows',
          label: 'Table Data Rows',
          type: 'object-list',
          itemLabel: 'Data Row',
          fields: [
            { key: 'col1', label: 'Column 1 Value', type: 'text', placeholder: 'e.g. B.Tech Computer Science' },
            { key: 'col2', label: 'Column 2 Value', type: 'text', placeholder: 'e.g. 4 Years' },
            { key: 'col3', label: 'Column 3 Value', type: 'text', placeholder: 'e.g. 120 Seats' },
            { key: 'col4', label: 'Column 4 Value', type: 'text', placeholder: 'e.g. ₹1,25,000' },
          ],
        },
      ];
    case 'TIMELINE':
    case 'MILESTONES':
    case 'HISTORY':
      return [
        { key: 'badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Heritage & Growth' },
        {
          key: 'items',
          label: 'Milestones & History Steps',
          type: 'object-list',
          itemLabel: 'Milestone Year',
          fields: [
            { key: 'year', label: 'Year / Period *', type: 'text', placeholder: 'e.g. 1996' },
            { key: 'title', label: 'Milestone Title *', type: 'text', placeholder: 'e.g. Foundation of the College' },
            { key: 'badge', label: 'Recognition Badge (Optional)', type: 'text', placeholder: 'e.g. Historic Charter' },
            { key: 'description', label: 'Detailed Story / Description', type: 'textarea', placeholder: 'Narrative of what was established...' },
            { key: 'imageUrl', label: 'Archive Photo URL (Optional)', type: 'image', help: 'Historical picture' },
          ],
        },
      ];
    case 'TABS':
    case 'CONTENT_TABS':
    case 'TABS_LAYOUT':
      return [
        { key: 'badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Program Overview' },
        {
          key: 'tabs',
          label: 'Content Tabs',
          type: 'object-list',
          itemLabel: 'Tab Panel',
          fields: [
            { key: 'title', label: 'Tab Title *', type: 'text', placeholder: 'e.g. Curriculum Overview' },
            { key: 'badge', label: 'Tab Badge (Optional)', type: 'text', placeholder: 'e.g. Updated 2026' },
            { key: 'content', label: 'Tab Body Content *', type: 'textarea', placeholder: 'Detailed rich information...' },
            { key: 'buttonText', label: 'Action Button Text (Optional)', type: 'text', placeholder: 'e.g. Download Syllabus PDF' },
            { key: 'buttonUrl', label: 'Action Button URL (Optional)', type: 'text', placeholder: 'https://... or /contact' },
          ],
        },
      ];
    case 'TESTIMONIALS':
    case 'TESTIMONIAL':
    case 'REVIEWS':
    case 'ALUMNI_STORIES':
      return [
        { key: 'badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Student Reflections' },
        {
          key: 'testimonials',
          label: 'Student & Alumni Reviews',
          type: 'object-list',
          itemLabel: 'Review / Story',
          fields: [
            { key: 'name', label: 'Student / Alumni Name *', type: 'text', placeholder: 'e.g. Sarah Jenkins' },
            { key: 'degree', label: 'Degree & Program', type: 'text', placeholder: 'e.g. B.Tech Computer Science' },
            { key: 'batch', label: 'Graduation Year / Batch', type: 'text', placeholder: 'e.g. Class of 2024' },
            { key: 'role', label: 'Current Role', type: 'text', placeholder: 'e.g. Software Engineer' },
            { key: 'company', label: 'Company / University', type: 'text', placeholder: 'e.g. Microsoft' },
            { key: 'avatarUrl', label: 'Student Photo URL', type: 'image', help: 'Headshot portrait photo' },
            { key: 'quote', label: 'Student Review / Quote *', type: 'textarea', placeholder: 'Reflections on campus experience and career mentorship...' },
            { key: 'rating', label: 'Star Rating (1 to 5)', type: 'number', placeholder: '5' },
          ],
        },
      ];
    case 'EMBED':
    case 'IFRAME':
    case 'VIRTUAL_TOUR':
      return [
        { key: 'badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Virtual Experience' },
        { key: 'embedUrl', label: 'Embed Iframe URL (HTTPS) *', type: 'text', placeholder: 'https://...' },
        { key: 'heightPx', label: 'Embed Height (in pixels)', type: 'number', placeholder: '480' },
        { key: 'allowFullscreen', label: 'Allow Fullscreen Mode', type: 'switch' },
        { key: 'caption', label: 'Caption Note Below Iframe', type: 'text', placeholder: 'e.g. Click and drag to explore the 360° virtual campus.' },
      ];
    case 'DEPARTMENTS':
    case 'COURSES':
    case 'FACULTY':
    case 'NEWS':
    case 'EVENTS':
    case 'NOTICES':
      return [
        { key: 'limit', label: 'Max Number of Items to Display', type: 'number', help: 'Leave blank to use default count (e.g. 4 or 6)' },
        { key: 'showExploreButton', label: 'Show "View All" Button at Bottom', type: 'switch' },
      ];
    case 'PLACEMENTS':
    case 'PLACEMENT_PARTNERS':
    case 'RECRUITERS':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. Corporate Recruiters & Placements' },
        { key: 'highlightText', label: 'Key Metric / CTC Callout', type: 'text', placeholder: 'e.g. Highest CTC ₹45 LPA | 98.4% Placement Record | 250+ Recruiter Partners' },
        { key: 'showExploreButton', label: 'Show "View Placement Cell" Button', type: 'switch' },
        { key: 'exploreUrl', label: 'Placement Portal / Page URL', type: 'text', placeholder: 'e.g. /placements' },
      ];
    case 'COMPLIANCE':
    case 'MANDATORY_DISCLOSURES':
    case 'DISCLOSURES':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. Statutory & AICTE Mandatory Disclosures' },
        {
          key: 'layout',
          label: 'Display Layout',
          type: 'select',
          options: [
            { label: 'Document List with Category Filter', value: 'list' },
            { label: 'Card Grid Matrix', value: 'grid' },
          ],
        },
        { key: 'showSearch', label: 'Enable Real-time Search Filter', type: 'switch' },
        { key: 'showCategories', label: 'Enable Category Tabs Filter', type: 'switch' },
        {
          key: 'documents',
          label: 'Statutory PDF Documents & Public Records',
          type: 'object-list',
          itemLabel: 'Compliance Document',
          fields: [
            { key: 'title', label: 'Document Title *', type: 'text', placeholder: 'e.g. AICTE Approval Letter 2026-27' },
            { key: 'category', label: 'Category / Regulatory Body', type: 'text', placeholder: 'e.g. AICTE, UGC, NAAC, NIRF, Anti-Ragging' },
            { key: 'fileUrl', label: 'PDF Document File / Link *', type: 'image', help: 'Upload official PDF file or paste public URL' },
            { key: 'fileType', label: 'Format Badge', type: 'text', placeholder: 'e.g. PDF' },
            { key: 'publishDate', label: 'Academic Year / Date', type: 'text', placeholder: 'e.g. 2026-27' },
          ],
        },
      ];
    case 'HOSTELS':
    case 'HOSTEL':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. Residential Campus Living' },
        {
          key: 'cards',
          label: 'Hostel Blocks & Amenities',
          type: 'object-list',
          itemLabel: 'Hostel Block',
          fields: [
            { key: 'title', label: 'Hostel Block Name *', type: 'text', placeholder: 'e.g. Ganga Boys Residence (Block A)' },
            { key: 'desc', label: 'Description & Facilities', type: 'textarea', placeholder: 'e.g. High-speed Wi-Fi, 24x7 security, RO water, AC & Non-AC rooms with attached baths.' },
            { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. Building2, Shield, Wifi, Coffee, Users' },
          ],
        },
      ];
    case 'TRANSPORT':
    case 'BUS_ROUTES':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. College Bus Transit Network' },
        {
          key: 'cards',
          label: 'Bus Routes & Key Transit Lines',
          type: 'object-list',
          itemLabel: 'Transit Route',
          fields: [
            { key: 'title', label: 'Route Title & Number *', type: 'text', placeholder: 'e.g. Route 12 - Central Railway Station to Campus' },
            { key: 'desc', label: 'Timing & Major Pickup Stops', type: 'textarea', placeholder: 'e.g. Departs 07:15 AM via Guindy, Tambaram, Chromepet, Vandalur.' },
            { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. Navigation, MapPin, Clock, Shield' },
          ],
        },
      ];
    case 'LIBRARY':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. Central Library & E-Learning Commons' },
        {
          key: 'cards',
          label: 'Library Sections & Digital Repositories',
          type: 'object-list',
          itemLabel: 'Library Wing / Resource',
          fields: [
            { key: 'title', label: 'Resource / Wing Title *', type: 'text', placeholder: 'e.g. IEEE & ScienceDirect Digital Lab' },
            { key: 'desc', label: 'Description & Access Details', type: 'textarea', placeholder: 'e.g. Access 10,000+ peer-reviewed international journals and e-books 24/7.' },
            { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. BookOpen, Globe, Laptop, Database' },
          ],
        },
      ];
    case 'ALUMNI':
      return [
        { key: 'badge', label: 'Section Badge Tag', type: 'text', placeholder: 'e.g. Distinguished Alumni Network' },
        {
          key: 'testimonials',
          label: 'Alumni Spotlights & Testimonials',
          type: 'object-list',
          itemLabel: 'Alumni Profile',
          fields: [
            { key: 'name', label: 'Alumni Name *', type: 'text', placeholder: 'e.g. Rajesh Kumar' },
            { key: 'degree', label: 'Degree & Department', type: 'text', placeholder: 'e.g. B.Tech Computer Science' },
            { key: 'batch', label: 'Graduation Year / Batch', type: 'text', placeholder: 'e.g. Class of 2018' },
            { key: 'role', label: 'Current Designation', type: 'text', placeholder: 'e.g. Senior Cloud Architect' },
            { key: 'company', label: 'Company / Organization', type: 'text', placeholder: 'e.g. Google Cloud' },
            { key: 'avatarUrl', label: 'Portrait Photo URL', type: 'image', help: 'Alumni headshot photo' },
            { key: 'quote', label: 'Career Reflection / Quote *', type: 'textarea', placeholder: 'The rigorous curriculum and faculty mentorship shaped my journey...' },
          ],
        },
      ];
    case 'CONTACT':
      return [
        { key: 'phone', label: 'Admissions Contact Phone', type: 'text', placeholder: 'e.g. +91 (044) 2890-5000' },
        { key: 'email', label: 'Admissions Contact Email', type: 'text', placeholder: 'e.g. admissions@university.edu' },
        { key: 'address', label: 'Campus Physical Address', type: 'textarea', placeholder: 'e.g. University Main Campus, Academic Expressway - 600100' },
        { key: 'showInquiryForm', label: 'Show Student Admissions Inquiry Form', type: 'switch' },
        { key: 'showMap', label: 'Show Interactive Campus Map & Location', type: 'switch' },
      ];
    default:
      return null;
  }
};

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400';

const TEXTAREA_CLASS =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-2xs placeholder:text-slate-400';

interface SectionContentEditorProps {
  sectionType: string;
  content: Record<string, any> | null | undefined;
  onChange: (content: Record<string, any>) => void;
  onJsonError?: (hasError: boolean) => void;
  availablePages?: { id?: string | number; title: string; slug: string }[];
}

export const SectionContentEditor: React.FC<SectionContentEditorProps> = ({
  sectionType,
  content,
  onChange,
  onJsonError,
  availablePages = [],
}) => {
  const [showJsonMode, setShowJsonMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState<string>(() => JSON.stringify(content || {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const fields = useMemo(() => getFieldsForType(sectionType), [sectionType]);

  const set = (key: string, val: any) => {
    const updated = { ...(content || {}) };
    if (val === undefined || val === '' || val === null) {
      delete updated[key];
    } else {
      updated[key] = val;
    }
    onChange(updated);
    syncJsonDraft(updated);
  };

  const syncJsonDraft = (c: Record<string, any>) => {
    setJsonDraft(JSON.stringify(c || {}, null, 2));
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonDraft);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setJsonError('Content must be a JSON object (e.g. { "heading": "..." })');
        onJsonError?.(true);
        return;
      }
      setJsonError(null);
      onJsonError?.(false);
      onChange(parsed);
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON syntax');
      onJsonError?.(true);
    }
  };

  const isImageField = (key: string, label: string) => {
    const k = key.toLowerCase();
    const l = label.toLowerCase();
    return (
      k.includes('image') ||
      k.includes('photo') ||
      k.includes('avatar') ||
      k.includes('poster') ||
      k.includes('cover') ||
      l.includes('image') ||
      l.includes('photo') ||
      l.includes('avatar')
    );
  };

  const isIconField = (key: string, label: string) => {
    const k = key.toLowerCase();
    const l = label.toLowerCase();
    return (
      k === 'icon' ||
      k === 'iconname' ||
      k.includes('icon') ||
      l.includes('icon')
    );
  };

  const isUrlField = (key: string, label: string) => {
    const k = key.toLowerCase();
    const l = label.toLowerCase();
    if (isImageField(key, label) || isIconField(key, label)) {
      return false;
    }
    return (
      k.endsWith('url') ||
      k.endsWith('link') ||
      k.endsWith('slug') ||
      k.includes('ctalink') ||
      k.includes('buttonurl') ||
      k.includes('buttonlink') ||
      k.includes('targeturl') ||
      k.includes('cardprimarybuttonurl') ||
      k.includes('secondaryctalink') ||
      k.includes('secondarybuttonurl') ||
      l.includes('url') ||
      l.includes('slug') ||
      l.includes('link')
    );
  };

  const renderScalar = (field: ContentField, value: any, onChangeValue: (v: any) => void) => {
    if (field.type === 'image' || isImageField(field.key, field.label)) {
      return (
        <FileUploadInput
          label={field.label}
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChangeValue(val)}
          placeholder="Upload image file or enter photo URL"
          helpText={field.help}
        />
      );
    }

    if (field.type === 'icon' || isIconField(field.key, field.label)) {
      return (
        <IconPicker
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChangeValue(val)}
          placeholder={field.placeholder || 'Select an icon...'}
        />
      );
    }

    if (field.type === 'url' || isUrlField(field.key, field.label)) {
      return (
        <PageUrlPicker
          value={typeof value === 'string' ? value : ''}
          onChange={(val) => onChangeValue(val)}
          placeholder={field.placeholder || 'Select page or enter URL (/admissions, https://...)'}
          availablePages={availablePages}
          help={field.help}
        />
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder || field.label}
            className={INPUT_CLASS}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : value == null || value === '' ? '' : String(value)}
            placeholder={field.placeholder || field.label}
            className={INPUT_CLASS}
            onChange={(e) => onChangeValue(e.target.value === '' ? undefined : Number(e.target.value))}
          />
        );
      case 'textarea':
        return (
          <textarea
            rows={3}
            value={typeof value === 'string' ? value : ''}
            placeholder={field.placeholder || field.label}
            className={TEXTAREA_CLASS}
            onChange={(e) => onChangeValue(e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            value={typeof value === 'string' ? value : ''}
            className={INPUT_CLASS}
            onChange={(e) => onChangeValue(e.target.value)}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'switch':
        return (
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{field.label}</span>
              {field.help && <p className="text-[11px] text-slate-400 mt-0.5">{field.help}</p>}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={Boolean(value)}
              onClick={() => onChangeValue(!value)}
              className={`relative inline-flex shrink-0 transition-colors duration-200 rounded-full border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 h-5 w-9 cursor-pointer ${
                value ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 h-4 w-4 ${
                  value ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        );
    }
  };

  const renderObjectList = (field: ObjectListField) => {
    const list: any[] = Array.isArray(content?.[field.key]) ? content[field.key] : [];
    const updateItem = (index: number, key: string, value: any) => {
      const next = [...list];
      const item = { ...(next[index] || {}) };
      if (value === '' || value === null || value === undefined) {
        delete item[key];
      } else {
        item[key] = value;
      }
      next[index] = item;
      set(field.key, next);
    };
    const move = (index: number, dir: -1 | 1) => {
      const target = index + dir;
      if (target < 0 || target >= list.length) return;
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      set(field.key, next);
    };
    return (
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{field.label}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {list.length} item{list.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={() => set(field.key, [...list, {}])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add {field.itemLabel}</span>
          </button>
        </div>

        {list.length === 0 && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No {field.label.toLowerCase()} added yet.
            </p>
            <p className="text-[11px] text-slate-400">
              Click the "+ Add {field.itemLabel}" button to create your first item.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3.5 shadow-2xs transition hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                <span className="text-xs font-black text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-[10px]">
                    {index + 1}
                  </span>
                  <span>{field.itemLabel} #{index + 1}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition disabled:opacity-20 cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === list.length - 1}
                    onClick={() => move(index, 1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition disabled:opacity-20 cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => set(field.key, list.filter((_, i) => i !== index))}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer ml-1"
                    title={`Delete ${field.itemLabel}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {field.fields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    {f.type !== 'image' && !isImageField(f.key, f.label) && (
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {f.label}
                      </label>
                    )}
                    {renderScalar(f, item[f.key], (v) => updateItem(index, f.key, v))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStringList = (field: StringListField) => {
    const list: string[] = Array.isArray(content?.[field.key]) ? content[field.key] : [];
    const updateItem = (index: number, value: string) => {
      const next = [...list];
      next[index] = value;
      set(field.key, next.filter((s) => s.trim().length > 0));
    };
    return (
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{field.label}</span>
          <button
            type="button"
            onClick={() => set(field.key, [...list, ''])}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
        <div className="space-y-2">
          {list.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                placeholder={field.placeholder || 'Enter checklist item...'}
                className={INPUT_CLASS}
                onChange={(e) => updateItem(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => set(field.key, list.filter((_, i) => i !== index))}
                className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Content Form Fields */}
      <div className="space-y-4">
        {(!fields || fields.length === 0) && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Automatic Dynamic Feed
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              This module automatically pulls data (news, courses, faculty, or departments) directly from your CMS records.
            </p>
          </div>
        )}

        {fields &&
          fields.map((field) => {
            if (field.type === 'object-list') {
              return <div key={field.key}>{renderObjectList(field)}</div>;
            }
            if (field.type === 'string-list') {
              return <div key={field.key}>{renderStringList(field)}</div>;
            }
            return (
              <div key={field.key} className="space-y-1.5">
                {field.type !== 'image' && field.type !== 'switch' && !isImageField(field.key, field.label) && (
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {field.label}
                  </label>
                )}
                {renderScalar(field, content?.[field.key], (v) => set(field.key, v))}
                {field.help && <p className="text-[11px] text-slate-400">{field.help}</p>}
              </div>
            );
          })}
      </div>

      {/* Collapsible Developer Raw JSON Accordion (Cleanly hidden at the bottom) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowJsonMode(!showJsonMode)}
          className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Developer JSON Mode (Advanced)</span>
          </div>
          {showJsonMode ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showJsonMode && (
          <div className="p-3.5 mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 space-y-2 animate-in fade-in duration-150">
            {jsonError && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400 bg-red-950/60 border border-red-800">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
            <textarea
              rows={8}
              value={jsonDraft}
              onChange={(e) => {
                setJsonDraft(e.target.value);
                setJsonError(null);
              }}
              onBlur={applyJson}
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-700 bg-slate-950 text-emerald-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400">
              Edits made here are synchronized directly into the section content object.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
