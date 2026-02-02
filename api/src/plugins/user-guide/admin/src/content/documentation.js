import React from 'react';
import {
  Box,
  Flex,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Badge,
  Alert,
  Accordion,
  AccordionToggle,
  AccordionContent,
  AccordionGroup,
} from '@strapi/design-system';
import styled from 'styled-components';

// Styled components
const Tip = styled(Box)`
  background: ${({ theme }) => theme.colors.primary100};
  border-left: 4px solid ${({ theme }) => theme.colors.primary600};
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  margin: 16px 0;
`;

const Warning = styled(Box)`
  background: ${({ theme }) => theme.colors.warning100};
  border-left: 4px solid ${({ theme }) => theme.colors.warning600};
  padding: 12px 16px;
  border-radius: 0 4px 4px 0;
  margin: 16px 0;
`;

const CodeBlock = styled(Box)`
  background: ${({ theme }) => theme.colors.neutral100};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  padding: 12px 16px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
`;

const StepNumber = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary600};
  color: white;
  font-weight: bold;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const StepItem = styled(Flex)`
  padding: 12px 0;
  align-items: flex-start;
`;

const ChecklistBox = styled(Box)`
  background: ${({ theme }) => theme.colors.neutral100};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`;

const ChecklistItem = styled(Flex)`
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ContentCard = styled(Box)`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
`;

// ============ SECTION COMPONENTS ============

// Getting Started Section
const GettingStartedSection = ({ highlightText, searchQuery }) => (
  <Box>
    <Typography variant="delta" as="h3">Accessing the Admin Panel</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography>The admin panel is where you manage all website content.</Typography>
      <CodeBlock marginTop={2}>
        <Typography>admin.geosolutions.nz</Typography>
      </CodeBlock>
      <Typography textColor="neutral600" paddingTop={2}>
        Enter this address in your browser to access the login page.
      </Typography>
    </Box>

    <Typography variant="delta" as="h3">Logging In</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <StepItem>
        <StepNumber>1</StepNumber>
        <Typography>Navigate to <strong>admin.geosolutions.nz</strong></Typography>
      </StepItem>
      <StepItem>
        <StepNumber>2</StepNumber>
        <Typography>Enter your email address</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>3</StepNumber>
        <Typography>Enter your password</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>4</StepNumber>
        <Typography>Click <strong>"Login"</strong></Typography>
      </StepItem>
      <Tip>
        <Typography><strong>Forgot your password?</strong> Contact your manager or IT administrator to have it reset.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">Dashboard Overview</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography>After logging in, you'll see the main dashboard with a navigation menu on the left:</Typography>
      <Box paddingTop={2}>
        <ul style={{ paddingLeft: '20px' }}>
          <li><Typography><strong>Content Manager</strong> - Edit website content, add team members, update projects</Typography></li>
          <li><Typography><strong>Media Library</strong> - View and manage all uploaded images and files</Typography></li>
          <li><Typography><strong>📚 User Guide</strong> - This documentation (accessible anytime)</Typography></li>
        </ul>
      </Box>
    </Box>

    <Typography variant="delta" as="h3">⚠️ Important: Restricted Areas</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Warning>
        <Typography><strong>The following sections should not be modified without administrator approval:</strong></Typography>
        <Box paddingTop={2}>
          <ul style={{ paddingLeft: '20px' }}>
            <li><Typography><strong>Content-Type Builder</strong> - Controls the website structure and data models</Typography></li>
            <li><Typography><strong>Roles & Permissions</strong> - Manages user access levels</Typography></li>
            <li><Typography><strong>API Tokens</strong> - Security credentials for external integrations</Typography></li>
            <li><Typography><strong>Webhooks</strong> - Automated system notifications</Typography></li>
            <li><Typography><strong>Settings → Users</strong> - User account management (admin only)</Typography></li>
          </ul>
        </Box>
        <Box paddingTop={3}>
          <Typography><strong>Best practice:</strong> Focus on Content Manager and Media Library for day-to-day content updates.</Typography>
        </Box>
      </Warning>
    </Box>

    <Typography variant="delta" as="h3">Main Navigation</Typography>
    <Box paddingTop={3}>
      <Typography>Primary menu items for content management:</Typography>
      <Box paddingTop={3}>
        <Table>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">Menu Item</Typography></Th>
              <Th><Typography variant="sigma">What It's For</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><Typography fontWeight="bold">Content Manager</Typography></Td>
              <Td><Typography>Edit website text, add team members, update projects, change photos</Typography></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Media Library</Typography></Td>
              <Td><Typography>See all uploaded photos and files in one place</Typography></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">📚 User Guide</Typography></Td>
              <Td><Typography>This help guide - come back here anytime you need help!</Typography></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Tip>
        <Typography paddingTop={2}><strong>Note:</strong> Most content updates are handled through Content Manager. Other sections are primarily for administrative purposes.</Typography>
      </Tip>
    </Box>
  </Box>
);

// Content Types Section
const ContentTypesSection = ({ highlightText, searchQuery, toggleAccordion, expandedSections }) => {
  const contentTypes = [
    {
      id: 'about',
      name: 'About',
      purpose: 'The "About Us" text that appears on the homepage',
      contains: ['Company story and description (with rich text formatting!)', 'What GeoSolutions does', 'Why customers should choose us', 'Add bold, italic, links and more'],
      appears: 'Homepage "About" section',
    },
    {
      id: 'services',
      name: 'Services Page',
      purpose: 'The services we offer to customers',
      contains: ['Introduction text with rich text formatting', 'List of each service', 'Make key words bold or add links'],
      appears: 'Services page',
    },
    {
      id: 'settings',
      name: 'Site Setting',
      purpose: 'Contact details that show at the bottom of every page',
      contains: ['Company tagline', 'Email address', 'Phone number', 'Physical address', 'Facebook/Instagram links'],
      appears: 'Website footer (bottom of every page)',
    },
    {
      id: 'hero',
      name: 'Hero',
      purpose: 'The big banner at the very top of the homepage with headline and call-to-action',
      contains: ['Main photo (should show GeoSolutions work)', 'Headline with rich text - make words bold or italic!', 'Subheading/tagline with formatting', 'Two customisable buttons with text and links', 'Option to show/hide each button'],
      appears: 'First thing visitors see on the homepage',
    },
    {
      id: 'team',
      name: 'Team',
      purpose: 'Staff profiles - who works at GeoSolutions',
      contains: ['Employee name', 'Job title', 'Photo of the person', 'Bio with rich text formatting - highlight qualifications!', 'Email address', 'Order number (lower numbers appear first)'],
      appears: 'Team page showing all employees',
    },
    {
      id: 'projects',
      name: 'Projects',
      purpose: 'Showcase of completed work to show potential customers',
      contains: ['Project name', 'Rich text description - add bullet points, bold text, links', 'Before and after photos', 'Project dates', 'SEO settings'],
      appears: 'Projects page portfolio',
    },
    {
      id: 'documents',
      name: 'Documents',
      purpose: 'Files that customers can download (like price lists or brochures)',
      contains: ['Document name', 'Short description of what it is', 'The actual file (PDF, Word doc, etc.)', 'Category to organize them', 'Date it was uploaded'],
      appears: 'Downloads or resources section of website',
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      purpose: 'What happy customers say about GeoSolutions',
      contains: ['Customer name', 'Their company name (optional)', 'Their review with rich text - emphasise key phrases!', 'Photo of customer (optional)', 'Link to related project', 'Order number (controls which shows first)'],
      appears: 'Homepage reviews section',
    },
  ];

  return (
    <Box>
      <Typography paddingBottom={2}>Content is organized into different types, each serving a specific purpose on the website.</Typography>
      <Typography paddingBottom={4}>Expand each section to see details:</Typography>
      <AccordionGroup>
        {contentTypes.map((type) => (
          <Accordion
            key={type.id}
            expanded={expandedSections[type.id]}
            onToggle={() => toggleAccordion(type.id)}
            id={`accordion-${type.id}`}
            size="S"
          >
            <AccordionToggle
              title={highlightText(type.name, searchQuery)}
              description={type.purpose}
            />
            <AccordionContent>
              <Box padding={4}>
                <Typography variant="delta">Contains:</Typography>
                <Box paddingTop={2} paddingBottom={3}>
                  <ul style={{ paddingLeft: '20px' }}>
                    {type.contains.map((item, idx) => (
                      <li key={idx}><Typography>{highlightText(item, searchQuery)}</Typography></li>
                    ))}
                  </ul>
                </Box>
                <Flex gap={2} alignItems="center">
                  <Badge>Where it appears:</Badge>
                  <Typography>{type.appears}</Typography>
                </Flex>
              </Box>
            </AccordionContent>
          </Accordion>
        ))}
      </AccordionGroup>
    </Box>
  );
};

// Editing Content Section
const EditingContentSection = ({ highlightText, searchQuery }) => (
  <Box>
    <Typography variant="delta" as="h3">Editing Text Content</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <StepItem>
        <StepNumber>1</StepNumber>
        <Typography>Click <strong>"Content Manager"</strong> in the left navigation</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>2</StepNumber>
        <Typography>Select the content type you want to edit</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>3</StepNumber>
        <Typography>Click on the entry to open it</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>4</StepNumber>
        <Typography>Make your changes in the text fields</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>5</StepNumber>
        <Typography>Click <strong>"Publish"</strong> to make changes live</Typography>
      </StepItem>
      <Tip>
        <Typography><strong>Note:</strong> Changes can be edited or reverted at any time.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">Uploading Images</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <StepItem>
        <StepNumber>1</StepNumber>
        <Typography>Open the content entry you want to edit</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>2</StepNumber>
        <Typography>Locate the image field (e.g., "Photo", "Image", or "Banner Image")</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>3</StepNumber>
        <Typography>Click <strong>"Add new assets"</strong> or the upload area</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>4</StepNumber>
        <Box>
          <Typography>Choose upload method:</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography><strong>From computer</strong> - Browse and select files</Typography></li>
            <li><Typography><strong>Media Library</strong> - Choose from previously uploaded images</Typography></li>
            <li><Typography><strong>Drag & drop</strong> - Drag files directly into the upload area</Typography></li>
          </ul>
        </Box>
      </StepItem>
      <StepItem>
        <StepNumber>5</StepNumber>
        <Typography>Wait for upload to complete (thumbnail will appear)</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>6</StepNumber>
        <Typography>Click <strong>"Publish"</strong></Typography>
      </StepItem>
      <Tip>
        <Typography><strong>Tip:</strong> Drag and drop is the fastest upload method.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">Reordering Items</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>Many content types use an Order field to control display sequence:</Typography>
      <StepItem>
        <StepNumber>1</StepNumber>
        <Typography>Open the item you want to move (like a team member)</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>2</StepNumber>
        <Typography>Look for a field called <strong>"Order"</strong> - it's just a number</Typography>
      </StepItem>
      <StepItem>
        <StepNumber>3</StepNumber>
        <Box>
          <Typography>Change the number based on where you want it:</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography><strong>1, 2, 3</strong> - These appear at the top</Typography></li>
            <li><Typography><strong>99, 100</strong> - These appear at the bottom</Typography></li>
          </ul>
        </Box>
      </StepItem>
      <StepItem>
        <StepNumber>4</StepNumber>
        <Typography>Click <strong>"Publish"</strong> and check the website</Typography>
      </StepItem>
      <ContentCard>
        <Typography variant="epsilon">Real Example:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography>Want John to be the first team member shown? Set his Order to <strong>1</strong></Typography></li>
          <li><Typography>Want Sarah second? Set her Order to <strong>2</strong></Typography></li>
          <li><Typography>Want an old project at the bottom? Set its Order to <strong>99</strong></Typography></li>
        </ul>
      </ContentCard>
    </Box>

    <Typography variant="delta" as="h3">Save vs Publish</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>Understanding the difference between saving and publishing:</Typography>
      <Box paddingTop={3}>
        <Table>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">Button</Typography></Th>
              <Th><Typography variant="sigma">What Happens</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><Typography fontWeight="bold">Save</Typography></Td>
              <Td><Typography>Saves your work BUT doesn't show on website yet - good for "work in progress"</Typography></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Publish</Typography></Td>
              <Td><Typography>Makes it live on the website RIGHT NOW - everyone can see it</Typography></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Unpublish</Typography></Td>
              <Td><Typography>Removes it from the website - makes it hidden again</Typography></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Tip>
        <Typography paddingTop={3}><strong>Best practice:</strong> If you're not 100% sure, click "Save" first. Look at it tomorrow. Then come back and click "Publish" when you're ready.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">✨ Rich Text Editor - Your Creative Toolkit</Typography>
    <Box paddingTop={3}>
      <Typography>Many fields now support <strong>rich text formatting</strong> - just like writing in Word or Google Docs! This lets you make your content stand out and look professional.</Typography>
      <Tip>
        <Typography><strong>🎨 Where can I use rich text?</strong> Hero headlines, About section, Services intro, Project descriptions, Team bios, and Testimonial quotes all support formatting!</Typography>
      </Tip>
      <ContentCard>
        <Typography variant="epsilon">Available formatting options:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography><strong>Bold</strong> - Make important words stand out (select text → click <strong>B</strong>)</Typography></li>
          <li><Typography><em>Italic</em> - Add emphasis or style (select text → click <em>I</em>)</Typography></li>
          <li><Typography><strong>Links</strong> - Add clickable links to other pages or websites</Typography></li>
          <li><Typography><strong>Bullet lists</strong> - Perfect for listing services or features</Typography></li>
          <li><Typography><strong>Numbered lists</strong> - Great for step-by-step instructions</Typography></li>
          <li><Typography><strong>Headings</strong> - Organize longer content into sections</Typography></li>
        </ul>
      </ContentCard>
      <ContentCard>
        <Typography variant="epsilon">💡 Creative Ideas:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography><strong>Hero headline:</strong> "Welcome to <em>GeoSolutions</em>" or "Your <strong>Trusted</strong> Geotechnical Partner"</Typography></li>
          <li><Typography><strong>Team bio:</strong> "Sarah has <strong>15 years experience</strong> in geotechnical engineering..."</Typography></li>
          <li><Typography><strong>Project description:</strong> Use bullet points to list what was achieved</Typography></li>
          <li><Typography><strong>Testimonial:</strong> "<em>Absolutely fantastic service!</em> The team went above and beyond..."</Typography></li>
        </ul>
      </ContentCard>
      <Tip>
        <Typography paddingTop={3}><strong>Pro tip:</strong> Don't overdo it! A few bold words have more impact than bolding everything. Use formatting to guide the reader's eye to what matters most.</Typography>
      </Tip>
    </Box>
  </Box>
);

// Image Guidelines Section
const ImageGuidelinesSection = () => (
  <Box>
    <Typography variant="delta" as="h3">Recommended Image Sizes</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>Use these dimensions for optimal display:</Typography>
      <Box paddingTop={3}>
        <Table>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">Type of Photo</Typography></Th>
              <Th><Typography variant="sigma">Best Size</Typography></Th>
              <Th><Typography variant="sigma">Shape</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><Typography fontWeight="bold">Homepage Banner</Typography></Td>
              <Td><Typography>1920 x 600 pixels</Typography></Td>
              <Td><Badge>Wide rectangle</Badge></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Team Member Photos</Typography></Td>
              <Td><Typography>400 x 400 pixels</Typography></Td>
              <Td><Badge>Square</Badge></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Project Photos</Typography></Td>
              <Td><Typography>800 x 600 pixels</Typography></Td>
              <Td><Badge>Rectangle</Badge></Td>
            </Tr>
            <Tr>
              <Td><Typography fontWeight="bold">Customer Review Photos</Typography></Td>
              <Td><Typography>200 x 200 pixels</Typography></Td>
              <Td><Badge>Small square</Badge></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Tip>
        <Typography paddingTop={3}><strong>Don't stress about exact sizes!</strong> The website will automatically resize them. These are just the "ideal" sizes for best quality.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">File Formats</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>Choose the appropriate format for your images:</Typography>
      <Box paddingTop={3}>
        <ContentCard>
          <Typography fontWeight="bold">JPG (Recommended):</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography>Project photos</Typography></li>
            <li><Typography>Team member photos</Typography></li>
            <li><Typography>Homepage banner</Typography></li>
            <li><Typography>Any photographic content</Typography></li>
          </ul>
        </ContentCard>
        <ContentCard>
          <Typography fontWeight="bold">PNG:</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography>Logos requiring transparent backgrounds</Typography></li>
            <li><Typography>Graphics with text overlays</Typography></li>
          </ul>
        </ContentCard>
      </Box>
      <Tip>
        <Typography><strong>General rule:</strong> Use JPG for photographs, PNG for logos and graphics.</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">File Size Guidelines</Typography>
    <Box paddingTop={3}>
      <Typography paddingBottom={2}>Keep files optimized for web performance:</Typography>
      <Box paddingTop={3}>
        <Table>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">File Size</Typography></Th>
              <Th><Typography variant="sigma">Result</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td><Badge active>Under 500 KB</Badge></Td>
              <Td><Typography>✓ Perfect! Upload it.</Typography></Td>
            </Tr>
            <Tr>
              <Td><Badge>500 KB - 1 MB</Badge></Td>
              <Td><Typography>OK, but could be smaller</Typography></Td>
            </Tr>
            <Tr>
              <Td><Badge textColor="danger600" backgroundColor="danger100">Over 1 MB</Badge></Td>
              <Td><Typography>✗ Too big! Will slow down the website</Typography></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Warning>
        <Typography><strong>Large files:</strong> Images over 2 MB should be compressed before upload. Contact your manager or IT administrator for assistance with image compression.</Typography>
      </Warning>
    </Box>
  </Box>
);

// SEO Best Practices Section
const SEOSection = () => (
  <Box>
    <Typography paddingBottom={4}>Search Engine Optimization (SEO) improves your website's visibility in search results.</Typography>

    <Typography variant="delta" as="h3">Page Titles</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>The page title appears in search results and browser tabs:</Typography>
      <ContentCard>
        <Typography variant="epsilon">Simple rules:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography>Keep it under 60 characters (Google cuts off longer titles)</Typography></li>
          <li><Typography>Include "GeoSolutions" in it</Typography></li>
          <li><Typography>Make it describe the page</Typography></li>
          <li><Typography>Don't use ALL CAPS</Typography></li>
        </ul>
      </ContentCard>
      <Box paddingTop={3}>
        <Flex gap={2} alignItems="center">
          <Badge active>✓ Good</Badge>
          <Typography>"Earthmoving Services Auckland | GeoSolutions"</Typography>
        </Flex>
        <Flex gap={2} alignItems="center" paddingTop={2}>
          <Badge textColor="danger600" backgroundColor="danger100">✗ Too long</Badge>
          <Typography>"Professional Commercial and Residential Earthmoving, Excavation, Landscaping Services..."</Typography>
        </Flex>
        <Flex gap={2} alignItems="center" paddingTop={2}>
          <Badge textColor="danger600" backgroundColor="danger100">✗ Too vague</Badge>
          <Typography>"Home Page"</Typography>
        </Flex>
      </Box>
    </Box>

    <Typography variant="delta" as="h3">Meta Descriptions</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>The description appears below the title in search results:</Typography>
      <ContentCard>
        <Typography variant="epsilon">Simple rules:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography>Keep it under 160 characters</Typography></li>
          <li><Typography>Write it like you're telling a friend what the page is about</Typography></li>
          <li><Typography>Include a reason to click (like "Free quote" or "See our work")</Typography></li>
        </ul>
      </ContentCard>
      <Tip>
        <Typography><strong>Example:</strong> "GeoSolutions provides excavation, earthmoving, and landscaping in Auckland. Family-owned business with 20+ years experience. Get a free quote today."</Typography>
      </Tip>
    </Box>

    <Typography variant="delta" as="h3">Image Alt Text</Typography>
    <Box paddingTop={3}>
      <Typography paddingBottom={2}>Alt text describes images for accessibility and search engines:</Typography>
      <ContentCard>
        <Typography variant="epsilon">How to write them:</Typography>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li><Typography>Describe what's in the photo in plain English</Typography></li>
          <li><Typography>Keep it short - one sentence</Typography></li>
          <li><Typography>Don't say "image of" or "photo of" - just describe it</Typography></li>
        </ul>
      </ContentCard>
      <Box paddingTop={3}>
        <Flex gap={2} alignItems="center">
          <Badge active>✓ Good</Badge>
          <Typography>"Excavator digging foundation for new house in Auckland"</Typography>
        </Flex>
        <Flex gap={2} alignItems="center" paddingTop={2}>
          <Badge active>✓ Good</Badge>
          <Typography>"John Smith, GeoSolutions site manager"</Typography>
        </Flex>
        <Flex gap={2} alignItems="center" paddingTop={2}>
          <Badge textColor="danger600" backgroundColor="danger100">✗ Too generic</Badge>
          <Typography>"IMG_1234" or "Photo"</Typography>
        </Flex>
      </Box>
      <Tip>
        <Typography paddingTop={3}><strong>Tip:</strong> Describe the image content concisely and naturally.</Typography>
      </Tip>
    </Box>
  </Box>
);

// Common Tasks Section
const CommonTasksSection = ({ toggleAccordion, expandedSections }) => {
  const tasks = [
    {
      id: 'add-team',
      title: 'Adding a New Employee to the Team Page',
      steps: [
        'On the left menu, click "Content Manager"',
        'Click on "Team"',
        'Click the blue "Create new entry" button at the top right',
        'Fill in their name, job title (like "Site Manager"), and upload a square photo',
        'Type a short bio if you want (what they do at GeoSolutions)',
        'Set Order number (1 = shows first, 99 = shows last)',
        'Click the green "Publish" button at the top right',
      ],
    },
    {
      id: 'add-project',
      title: 'Adding a Completed Project to the Portfolio',
      steps: [
        'Click "Content Manager" then "Projects"',
        'Click "Create new entry"',
        'Type the project name and description of what was done',
        'Select the category (residential, commercial, etc.)',
        'Upload 1-3 "before" photos',
        'Upload 1-3 "after" photos showing the finished work',
        'Add the location (suburb/city) and date completed',
        'Set Order number, then click "Publish"',
      ],
    },
    {
      id: 'change-contact',
      title: 'Changing Phone Number or Email Address',
      steps: [
        'Click "Content Manager" then "Site Setting"',
        'Click on the single entry that appears',
        'Update the email, phone number, or address',
        'You can also change the footer tagline and social media links here',
        'Click "Publish"',
        'Go to the website and scroll to the bottom - you should see your changes in the footer',
      ],
    },
    {
      id: 'add-testimonial',
      title: 'Adding a Customer Review',
      steps: [
        'Click "Content Manager" then "Testimonials"',
        'Click "Create new entry"',
        'Type the customer\'s name',
        'Type their company name if they have one (optional)',
        'Write their review - use bold or italic to emphasise key phrases!',
        'Upload their photo if you have one (optional)',
        'Tick "Featured" to show it on the homepage',
        'Set Order number, then click "Publish"',
      ],
    },
    {
      id: 'update-hero',
      title: 'Customising the Homepage Hero Section',
      steps: [
        'Click "Content Manager" then "Hero"',
        'Click on the entry to edit it',
        'Write your Heading - use **bold** or _italic_ for creative styling!',
        'Write your Subheading/tagline with optional formatting',
        'Set up Button 1: text, URL, and toggle on/off',
        'Set up Button 2 (optional): text, URL, and toggle on/off',
        'To change the banner image, click on it and upload a new wide photo (1920 x 600 pixels)',
        'Click "Publish" and visit the homepage to see your changes',
      ],
    },
  ];

  return (
    <Box>
      <Typography paddingBottom={4}>Step-by-step guides for frequently performed tasks:</Typography>
      <AccordionGroup>
        {tasks.map((task) => (
          <Accordion
            key={task.id}
            expanded={expandedSections[task.id]}
            onToggle={() => toggleAccordion(task.id)}
            id={`accordion-${task.id}`}
            size="S"
          >
            <AccordionToggle title={task.title} />
            <AccordionContent>
              <Box padding={4}>
                {task.steps.map((step, idx) => (
                  <StepItem key={idx}>
                    <StepNumber>{idx + 1}</StepNumber>
                    <Typography>{step}</Typography>
                  </StepItem>
                ))}
              </Box>
            </AccordionContent>
          </Accordion>
        ))}
      </AccordionGroup>
    </Box>
  );
};

// Troubleshooting Section
const TroubleshootingSection = ({ toggleAccordion, expandedSections }) => {
  const issues = [
    {
      id: 'not-appearing',
      title: 'I Published Something But It\'s Not Showing on the Website',
      solutions: [
        { label: 'Check it\'s actually published', detail: 'Open the item again and look for a green "Published" badge at the top. If it says "Draft", click the "Publish" button.' },
        { label: 'Refresh your browser', detail: 'Sometimes your browser shows an old version. Hold Shift and click the refresh button, or close the browser completely and open it again.' },
        { label: 'Check the right page', detail: 'Make sure you\'re looking at the correct page of the website. Team members show on the Team page, projects on the Projects page, etc.' },
        { label: 'Wait a minute', detail: 'Changes can take 30-60 seconds to appear. Go make a coffee and check again!' },
      ],
    },
    {
      id: 'images-not-loading',
      title: 'Photos Won\'t Upload or Appear as Broken',
      solutions: [
        { label: 'File too big', detail: 'If the photo is over 2-3 MB, it might be too big. Ask your manager to help compress it first.' },
        { label: 'Wrong file type', detail: 'Only use JPG or PNG files. Don\'t upload HEIC (iPhone), RAW, PSD, or other weird formats.' },
        { label: 'Wait for it to finish', detail: 'Don\'t click away while the photo is uploading. Wait until you see a small version of it appear.' },
        { label: 'Try again', detail: 'Remove the photo, click Save, then re-open and try uploading it again.' },
      ],
    },
    {
      id: 'changes-not-showing',
      title: 'I Changed Text But It Still Shows the Old Version',
      solutions: [
        { label: 'Hard refresh your browser', detail: 'Hold Shift and press the refresh button. Or press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac).' },
        { label: 'Try incognito mode', detail: 'Open an incognito/private window in your browser and check the website there.' },
        { label: 'Make sure you published', detail: 'Open the item and check it says "Published" not "Draft" at the top.' },
        { label: 'Check you\'re on the right website', detail: 'Make sure the address bar says geosolutions.nz, not admin.geosolutions.nz' },
      ],
    },
    {
      id: 'cant-upload',
      title: 'Upload Button Doesn\'t Work',
      solutions: [
        { label: 'File too big', detail: 'Files over 5 MB might not work. Compress photos before uploading.' },
        { label: 'Permission issue', detail: 'Your account might not have permission to upload. Ask your manager.' },
        { label: 'Try different browser', detail: 'Try using Chrome or Firefox instead of Safari or Edge.' },
        { label: 'Check file type', detail: 'Photos: JPG, PNG only. Documents: PDF, Word docs. Nothing else!' },
      ],
    },
  ];

  return (
    <Box>
      <Typography paddingBottom={4}>Common issues and solutions:</Typography>
      <AccordionGroup>
        {issues.map((issue) => (
          <Accordion
            key={issue.id}
            expanded={expandedSections[issue.id]}
            onToggle={() => toggleAccordion(issue.id)}
            id={`accordion-${issue.id}`}
            size="S"
          >
            <AccordionToggle title={issue.title} />
            <AccordionContent>
              <Box padding={4}>
                {issue.solutions.map((solution, idx) => (
                  <Box key={idx} paddingBottom={3}>
                    <Typography fontWeight="bold">{idx + 1}. {solution.label}</Typography>
                    <Typography textColor="neutral600" paddingTop={1}>{solution.detail}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionContent>
          </Accordion>
        ))}
      </AccordionGroup>

      <Warning>
        <Typography><strong>Need additional help?</strong></Typography>
        <Box paddingTop={2}>
          <Typography>1. Take a screenshot of the issue</Typography>
          <Typography>2. Note what you were attempting to do</Typography>
          <Typography>3. Contact your manager or IT administrator</Typography>
        </Box>
        <Box paddingTop={3}>
          <Typography><strong>Security note:</strong> Never share your password. Administrators can assist without needing your credentials.</Typography>
        </Box>
      </Warning>
    </Box>
  );
};

// Quick Reference Section
const QuickReferenceSection = () => (
  <Box>
    <Typography variant="delta" as="h3">Image Size Reference</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Typography paddingBottom={2}>Quick reference for image dimensions:</Typography>
      <ContentCard>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><Typography><strong>Homepage banner:</strong> Wide photo, 1920 x 600 pixels</Typography></li>
          <li><Typography><strong>Team member photo:</strong> Square, 400 x 400 pixels</Typography></li>
          <li><Typography><strong>Project photos:</strong> 800 x 600 pixels</Typography></li>
          <li><Typography><strong>Customer review photo:</strong> Small square, 200 x 200 pixels</Typography></li>
          <li><Typography><strong>Maximum file size:</strong> Keep under 1-2 MB</Typography></li>
        </ul>
      </ContentCard>
    </Box>

    <Typography variant="delta" as="h3">Keyboard Shortcuts</Typography>
    <Box paddingTop={3} paddingBottom={4}>
      <Table>
        <Thead>
          <Tr>
            <Th><Typography variant="sigma">What You Want to Do</Typography></Th>
            <Th><Typography variant="sigma">Windows</Typography></Th>
            <Th><Typography variant="sigma">Mac</Typography></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td><Typography>Save your work</Typography></Td>
            <Td><Typography>Ctrl + S</Typography></Td>
            <Td><Typography>Cmd + S</Typography></Td>
          </Tr>
          <Tr>
            <Td><Typography>Make text bold</Typography></Td>
            <Td><Typography>Ctrl + B</Typography></Td>
            <Td><Typography>Cmd + B</Typography></Td>
          </Tr>
          <Tr>
            <Td><Typography>Make text italic</Typography></Td>
            <Td><Typography>Ctrl + I</Typography></Td>
            <Td><Typography>Cmd + I</Typography></Td>
          </Tr>
          <Tr>
            <Td><Typography>Refresh page properly</Typography></Td>
            <Td><Typography>Ctrl + Shift + R</Typography></Td>
            <Td><Typography>Cmd + Shift + R</Typography></Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>

    <Typography variant="delta" as="h3">Pre-Publish Checklist</Typography>
    <Box paddingTop={3}>
      <Typography paddingBottom={2}>Review these items before publishing:</Typography>
      <ChecklistBox>
        <ChecklistItem gap={2}>
          <Typography>☐</Typography>
          <Typography>Spelling and grammar look good?</Typography>
        </ChecklistItem>
        <ChecklistItem gap={2}>
          <Typography>☐</Typography>
          <Typography>Photos uploaded and look clear?</Typography>
        </ChecklistItem>
        <ChecklistItem gap={2}>
          <Typography>☐</Typography>
          <Typography>Phone numbers and emails are correct?</Typography>
        </ChecklistItem>
        <ChecklistItem gap={2}>
          <Typography>☐</Typography>
          <Typography>Did you add alt text to photos?</Typography>
        </ChecklistItem>
        <ChecklistItem gap={2}>
          <Typography>☐</Typography>
          <Typography>Everything looks good? Click Publish! ✓</Typography>
        </ChecklistItem>
      </ChecklistBox>
    </Box>

    <Typography variant="delta" as="h3" paddingTop={4}>Best Practices</Typography>
    <Box paddingTop={3}>
      <Flex gap={4}>
        <Box style={{ flex: 1 }}>
          <Typography fontWeight="bold" textColor="success600">✓ Recommended:</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography>Save your work often</Typography></li>
            <li><Typography>Use JPG for photos</Typography></li>
            <li><Typography>Keep file sizes under 1 MB</Typography></li>
            <li><Typography>Test on your phone too</Typography></li>
            <li><Typography>Ask if you're unsure</Typography></li>
          </ul>
        </Box>
        <Box style={{ flex: 1 }}>
          <Typography fontWeight="bold" textColor="danger600">✗ Avoid:</Typography>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li><Typography>Touch Content-Type Builder</Typography></li>
            <li><Typography>Change anything in Settings → Roles</Typography></li>
            <li><Typography>Upload massive files (over 2 MB)</Typography></li>
            <li><Typography>Share your password</Typography></li>
            <li><Typography>Click stuff you don't understand</Typography></li>
          </ul>
        </Box>
      </Flex>
    </Box>

    <Box paddingTop={6}>
      <Typography textColor="neutral600" textAlign="center">
        For additional assistance, refer to this guide anytime by clicking 📚 User Guide in the navigation menu.
      </Typography>
    </Box>
  </Box>
);

// ============ EXPORT DOCUMENTATION CONTENT ============

export const documentationContent = [
  {
    id: 'getting-started',
    title: '🚀 Getting Started',
    content: 'Learn how to access and navigate the admin panel.',
    component: GettingStartedSection,
  },
  {
    id: 'content-types',
    title: '📁 Content Types Overview',
    content: 'Understanding the different types of content you can manage.',
    component: ContentTypesSection,
  },
  {
    id: 'editing-content',
    title: '✏️ How to Edit Content',
    content: 'Step-by-step instructions for editing, uploading, and publishing.',
    component: EditingContentSection,
  },
  {
    id: 'image-guidelines',
    title: '🖼️ Image Guidelines',
    content: 'Recommended sizes, formats, and best practices for images.',
    component: ImageGuidelinesSection,
  },
  {
    id: 'seo-best-practices',
    title: '🔍 SEO Best Practices',
    content: 'Optimize your content for search engines.',
    component: SEOSection,
  },
  {
    id: 'common-tasks',
    title: '📋 Common Tasks',
    content: 'Quick guides for frequently performed actions.',
    component: CommonTasksSection,
  },
  {
    id: 'troubleshooting',
    title: '🔧 Troubleshooting',
    content: 'Solutions for common issues.',
    component: TroubleshootingSection,
  },
  {
    id: 'quick-reference',
    title: '⚡ Quick Reference',
    content: 'Shortcuts, checklists, and best practices at a glance.',
    component: QuickReferenceSection,
  },
];
