import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import React from 'react';

const tw = createTw({});

// Improved styles with better structure
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  fullWidthBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 240,
  },
  bannerImage: {
    width: '110%',
    objectFit: 'cover',
    objectPosition: 'top left',
  },
  contentContainer: {
    marginTop: 260,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: 10,
  },
  headerLogo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  instituteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  instituteTagline: {
    fontSize: 9,
    color: '#666666',
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  subtitle: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333333',
  },
  questionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#333333',
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 3,
    color: '#333333',
  },
  normalText: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#333333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  bulletPoint: {
    marginLeft: 15,
    fontSize: 10,
    lineHeight: 1.5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletMarker: {
    width: 15,
    fontSize: 10,
  },
  highlightBox: {
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0066CC',
  },
  highlightText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  transformationSection: {
    backgroundColor: '#f5f0ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6633CC',
    marginBottom: 5,
  },
  phaseContent: {
    marginLeft: 15,
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    padding: 3,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    padding: 3,
  },
});

// Custom Page component with banner
const PageWithBanner = ({ children, size = "A4" }) => (
  <Page size={size} style={styles.page} wrap={false}>
    <View style={styles.fullWidthBanner} fixed>
      <Image
        src="/banner.png"
        style={styles.bannerImage}
        cache={false}
      />
    </View>
    <View style={styles.contentContainer}>
      {children}
    </View>
  </Page>
);

// Clean text of special characters and emojis
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/🧠|💡|💎|📅|🧭/g, '') // Remove emojis
    .replace(/\*\*|\*|\_\_|\_/g, '') // Remove markdown formatting
    .trim();
};

// Structured data types for sections
type Section = {
  type: 'section' | 'question' | 'subsection' | 'bullet' | 'highlight' | 'phase' | 'normal';
  title?: string;
  content?: string;
  items?: string[];
};

type MilestoneItem = {
  milestone: string;
  targetWeek: string;
  toolsAndFocus: string;
};

// Build content from structured data
const renderSection = (section: Section, key: string | number) => {
  switch (section.type) {
    case 'section':
      return (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.content && <Text style={styles.normalText}>{section.content}</Text>}
          {section.items && section.items.map((item, idx) => (
            <View key={`${key}_item_${idx}`} style={styles.bulletRow}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletPoint}>{item}</Text>
            </View>
          ))}
        </View>
      );
      
    case 'question':
      return (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text style={styles.questionTitle}>{section.title}</Text>
          {section.content && <Text style={styles.normalText}>{section.content}</Text>}
        </View>
      );
      
    case 'subsection':
      return (
        <View key={key} style={{ marginBottom: 8 }}>
          <Text style={styles.subsectionTitle}>{section.title}</Text>
          {section.content && <Text style={styles.normalText}>{section.content}</Text>}
        </View>
      );
      
    case 'bullet':
      return (
        <View key={key} style={styles.bulletRow}>
          <Text style={styles.bulletMarker}>•</Text>
          <Text style={styles.bulletPoint}>{section.content}</Text>
        </View>
      );
      
    case 'highlight':
      return (
        <View key={key} style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>{section.title}</Text>
          <Text style={styles.highlightText}>{section.content}</Text>
        </View>
      );
      
    case 'phase':
      return (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text style={styles.phaseTitle}>{section.title}</Text>
          <Text style={styles.phaseContent}>{section.content}</Text>
        </View>
      );
      
    case 'normal':
    default:
      return (
        <Text key={key} style={styles.normalText}>{section.content}</Text>
      );
  }
};

// Render milestone table
const renderMilestoneTable = (milestones: MilestoneItem[]) => (
  <View style={{ marginVertical: 15 }}>
    <Text style={styles.sectionTitle}>12-Week Milestone Map</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.tableCellHeader}>Milestone</Text>
      <Text style={styles.tableCellHeader}>Target Week</Text>
      <Text style={styles.tableCellHeader}>Tools & Focus</Text>
    </View>
    {milestones.map((milestone, i) => (
      <View key={i} style={styles.tableRow}>
        <Text style={styles.tableCell}>{milestone.milestone}</Text>
        <Text style={styles.tableCell}>{milestone.targetWeek}</Text>
        <Text style={styles.tableCell}>{milestone.toolsAndFocus}</Text>
      </View>
    ))}
  </View>
);

// Group sections into pages
const groupSectionsIntoPages = (sections: Section[], maxSectionsPerPage: number = 6) => {
  const pages: Section[][] = [];
  let currentPage: Section[] = [];
  
  for (const section of sections) {
    // Check if we need to start a new page
    if (currentPage.length >= maxSectionsPerPage) {
      pages.push([...currentPage]);
      currentPage = [];
    }
    
    currentPage.push(section);
  }
  
  // Add any remaining sections
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

// Parse raw content into structured data format for client report
const parseClientContent = (content: string) => {
  // This is where OpenAI could provide structured JSON instead of raw text
  // For now, we'll parse the content based on some expected patterns
  
  const sections: Section[] = [];
  const lines = content.split('\n');
  
  let currentSection: Section | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Detect section types based on content patterns
    if (line.match(/^Client Response:/)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: 'normal',
        content: line
      };
      sections.push(currentSection);
      currentSection = null;
    }
    else if (line.match(/^DreamScape AI Insight:/)) {
      currentSection = {
        type: 'subsection',
        title: line,
        content: ''
      };
    }
    else if (line.match(/^💡 What the Neuro Change Method™ Can Do for You/)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: 'highlight',
        title: line,
        content: ''
      };
    }
    else if (line.match(/^💎 Why Now, Why You, and Why a Neuro Change Practitioner\?/)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: 'highlight',
        title: line,
        content: ''
      };
    }
    else if (line.match(/^\d+\./)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: 'question',
        title: line,
        content: ''
      };
    }
    else if (currentSection) {
      // Add content to current section
      currentSection.content = currentSection.content 
        ? `${currentSection.content}\n${line}` 
        : line;
    }
    else {
      // Create a new normal text section
      currentSection = {
        type: 'normal',
        content: line
      };
    }
  }
  
  // Add final section if exists
  if (currentSection) sections.push(currentSection);
  
  return sections;
};

// Parse raw content into structured data format for practitioner report
const parsePractitionerContent = (content: string) => {
  const sections: Section[] = [];
  const lines = content.split('\n');
  
  let currentSection: Section | null = null;
  let milestones: MilestoneItem[] = [];
  let inMilestoneTable = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    if (line.match(/^Client Summary/) || 
        line.match(/^Primary Objective:/) ||
        line.match(/^Key Barriers:/) ||
        line.match(/^Transformation Theme:/) ||
        line.match(/^Projected Transformation Outcomes/) ||
        line.match(/^Practitioner Notes/)) {
      
      if (currentSection) sections.push(currentSection);
      
      currentSection = {
        type: 'section',
        title: line,
        content: '',
        items: []
      };
    }
    else if (line.match(/^🧠 Phase \d+:/)) {
      if (currentSection) sections.push(currentSection);
      
      currentSection = {
        type: 'phase',
        title: line,
        content: ''
      };
    }
    else if (line.match(/^12-Week Milestone Map/)) {
      if (currentSection) sections.push(currentSection);
      
      inMilestoneTable = true;
      currentSection = null;
    }
    else if (inMilestoneTable) {
      // Parse milestone table rows
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim());
        
        if (parts.length >= 3 && !line.includes('Milestone') && !line.includes('---')) {
          milestones.push({
            milestone: parts[0],
            targetWeek: parts[1],
            toolsAndFocus: parts[2]
          });
        }
      }
      else if (milestones.length > 0) {
        // End of milestone table
        inMilestoneTable = false;
      }
    }
    else if (line.startsWith('●')) {
      // Bullet point
      if (currentSection && currentSection.items) {
        currentSection.items.push(line.replace('●', '').trim());
      } else {
        sections.push({
          type: 'bullet',
          content: line.replace('●', '').trim()
        });
      }
    }
    else if (currentSection) {
      // Add content to current section
      currentSection.content = currentSection.content 
        ? `${currentSection.content}\n${line}` 
        : line;
    }
    else {
      // Create a new normal text section
      currentSection = {
        type: 'normal',
        content: line
      };
    }
  }
  
  // Add final section if exists
  if (currentSection) sections.push(currentSection);
  
  return { sections, milestones };
};

// Main export functions
export const generateClientPDF = async (firstName: string, clientContent: string) => {
  // Parse the raw content into structured data
  const sections = parseClientContent(clientContent);
  
  // Group sections into pages
  const pagesContent = groupSectionsIntoPages(sections);
  
  const ClientPDF = (
    <Document>
      <PageWithBanner size="A4">
        <Text style={styles.reportTitle}>Client Assessment Report for {firstName}</Text>
        <Text style={styles.subtitle}>Prepared by DreamScape AI</Text>

        {pagesContent[0]?.map((section, index) =>
          renderSection(section, `client_first_page_${index}`)
        )}
      </PageWithBanner>
      
      {pagesContent.slice(1).map((pageSections, pageIndex) => (
        <PageWithBanner key={`client_page_${pageIndex + 1}`} size="A4">
          {pageSections.map((section, sectionIndex) =>
            renderSection(section, `client_page${pageIndex + 1}_section${sectionIndex}`)
          )}
        </PageWithBanner>
      ))}
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

export const generatePractitionerPDF = async (firstName: string, practitionerContent: string) => {
  // Parse the raw content into structured data
  const { sections, milestones } = parsePractitionerContent(practitionerContent);
  
  // Group sections into pages - fewer sections per page for practitioner report
  const pagesContent = groupSectionsIntoPages(sections, 5);
  
  const PractitionerPDF = (
    <Document>
      <PageWithBanner size="A4">
        <Text style={styles.reportTitle}>🧭 Practitioner Case Report: {firstName}</Text>
        
        {pagesContent[0]?.map((section, index) =>
          renderSection(section, `prac_first_page_${index}`)
        )}
      </PageWithBanner>
      
      {pagesContent.slice(1).map((pageSections, pageIndex) => (
        <PageWithBanner key={`prac_page_${pageIndex + 1}`} size="A4">
          {pageSections.map((section, sectionIndex) =>
            renderSection(section, `prac_page${pageIndex + 1}_section${sectionIndex}`)
          )}
        </PageWithBanner>
      ))}
      
      {/* Add milestone table on its own page */}
      {milestones.length > 0 && (
        <PageWithBanner key="milestone_page" size="A4">
          {renderMilestoneTable(milestones)}
        </PageWithBanner>
      )}
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
};