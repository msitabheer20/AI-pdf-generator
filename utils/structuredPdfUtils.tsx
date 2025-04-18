import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
import React from 'react';

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
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'top left',
  },
  fixedHeader: {
    height: 260,
  },
  contentContainer: {
    marginTop: 260,
    width: '100%',
    position: 'relative',
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
    marginBottom: 10,
  },
  openingStatement: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#333333',
    marginBottom: 20,
    lineHeight: 1.5,
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
  phaseItem: {
    marginLeft: 15,
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 3,
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
  titleContainer: {
    marginBottom: 20,
    paddingBottom: 5,
    borderBottom: '1px solid #EEEEEE',
  },
  sectionSeparator: {
    borderBottom: '1px solid #EEEEEE',
    marginVertical: 15,
    width: '100%',
  },
  closingSection: {
    marginTop: 15,
    fontSize: 10,
    lineHeight: 1.5,
    fontStyle: 'italic',
    color: '#333333',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  }
});

// Custom Page component with banner
const PageWithBanner = ({ children }: { children: React.ReactNode }) => (
  <Page size="A4" style={styles.page} wrap>
    {/* Fixed banner that will appear on all pages at the same position */}
    <View style={styles.fullWidthBanner} fixed>
      <Image
        src="/banner.png"
        style={styles.bannerImage}
        cache={false}
      />
    </View>
    
    {/* Fixed empty header to ensure consistent spacing on all pages */}
    <View style={styles.fixedHeader} fixed>
      {/* This empty fixed view ensures banner space is reserved on all pages */}
    </View>
    
    {/* Content that will flow across pages with consistent top margin */}
    <View style={styles.contentContainer}>
      {children}
    </View>
  </Page>
);

// Clean text to fix character encoding issues
const cleanText = (text: string): string => {
  if (!text) return '';
  
  // Replace problematic characters and HTML entities
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '•')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[^\x00-\x7F]/g, char => {
      // For any non-ASCII character, try to replace with ASCII equivalent when possible
      // or remove if can't be safely replaced
      switch (char) {
        case '…': return '...';
        case '™': return 'TM';
        case '©': return '(c)';
        case '®': return '(R)';
        case '°': return 'deg';
        case '€': return 'EUR';
        case '£': return 'GBP';
        case '¥': return 'JPY';
        case '½': return '1/2';
        case '¼': return '1/4';
        case '¾': return '3/4';
        default: return ' '; // Replace unknown special characters with a space
      }
    });
};

// Section separator component
const SectionSeparator = () => (
  <View style={styles.sectionSeparator} />
);

// Types for structured data
type ContentType = 
  | 'section'
  | 'question'
  | 'subsection'
  | 'bullet'
  | 'highlight'
  | 'phase'
  | 'normal'
  | 'clientResponse'
  | 'aiInsight'
  | 'closing';

type ContentSection = {
  type: ContentType;
  title?: string;
  content?: string;
  items?: string[];
  points?: Record<string, string>;
};

type PhaseItem = {
  focus?: string;
  tools?: string;
  goal?: string;
};

type PhaseSection = {
  type: string;
  title: string;
  items: PhaseItem;
};

type MilestoneItem = {
  milestone: string;
  targetWeek: string;
  toolsAndFocus: string;
};

// Render client response and AI insight
const renderQuestionSection = (questionData: any, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.questionTitle}>{cleanText(questionData.title)}</Text>
    <View style={{ marginBottom: 8, marginLeft: 10 }} wrap>
      <Text style={styles.italicText}>{`Client Response: ${cleanText(questionData.clientResponse)}`}</Text>
    </View>
    <View style={{ marginBottom: 8 }} wrap>
      <Text style={styles.subsectionTitle}>DreamScape AI Insight:</Text>
      <Text style={styles.normalText}>{cleanText(questionData.aiInsight)}</Text>
    </View>
  </View>
);

// Render highlight section with points
const renderHighlightSection = (highlightData: any, key: string | number) => (
  <View key={key} style={styles.highlightBox} wrap>
    <Text style={styles.highlightTitle}>{cleanText(highlightData.title)}</Text>
    <Text style={styles.highlightText}>{cleanText(highlightData.content)}</Text>
    
    {highlightData.points && Object.entries(highlightData.points).map(([pointKey, pointValue], idx) => (
      <View key={`${key}_point_${idx}`} style={styles.bulletRow}>
        <Text style={styles.bulletMarker}>•</Text>
        <Text style={styles.bulletPoint}>{cleanText(pointValue as string)}</Text>
      </View>
    ))}
  </View>
);

// Render phase section with items
const renderPhaseSection = (phaseData: any, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.phaseTitle}>{cleanText(phaseData.title)}</Text>
    
    {phaseData.items && (
      <View style={{ marginLeft: 15 }}>
        {phaseData.items.focus && (
          <Text style={styles.phaseItem}>
            <Text style={styles.boldText}>Focus: </Text>
            {cleanText(phaseData.items.focus)}
          </Text>
        )}
        {phaseData.items.tools && (
          <Text style={styles.phaseItem}>
            <Text style={styles.boldText}>Tools: </Text>
            {cleanText(phaseData.items.tools)}
          </Text>
        )}
        {phaseData.items.goal && (
          <Text style={styles.phaseItem}>
            <Text style={styles.boldText}>Goal: </Text>
            {cleanText(phaseData.items.goal)}
          </Text>
        )}
      </View>
    )}
  </View>
);

// Render section with items (bullet points)
const renderSectionWithItems = (sectionData: any, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.sectionTitle}>{cleanText(sectionData.title)}</Text>
    {sectionData.content && <Text style={styles.normalText}>{cleanText(sectionData.content)}</Text>}
    
    {sectionData.items && sectionData.items.map((item: string, idx: number) => (
      <View key={`${key}_item_${idx}`} style={styles.bulletRow}>
        <Text style={styles.bulletMarker}>•</Text>
        <Text style={styles.bulletPoint}>{cleanText(item)}</Text>
      </View>
    ))}
  </View>
);

// Render milestone table
const renderMilestoneTable = (milestones: MilestoneItem[]) => (
  <View style={{ marginVertical: 15 }} wrap>
    <Text style={styles.sectionTitle}>12-Week Milestone Map</Text>
    <View style={styles.tableHeader}>
      <Text style={styles.tableCellHeader}>Milestone</Text>
      <Text style={styles.tableCellHeader}>Target Week</Text>
      <Text style={styles.tableCellHeader}>Tools & Focus</Text>
    </View>
    {milestones.map((milestone, i) => (
      <View key={i} style={styles.tableRow}>
        <Text style={styles.tableCell}>{cleanText(milestone.milestone)}</Text>
        <Text style={styles.tableCell}>{cleanText(milestone.targetWeek)}</Text>
        <Text style={styles.tableCell}>{cleanText(milestone.toolsAndFocus)}</Text>
      </View>
    ))}
  </View>
);

// Generate client PDF with properly structured data
export const generateClientPDF = async (firstName: string, clientReport: any) => {
  const report = clientReport;
  
  const ClientPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>
        
        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />
        
        {/* Content with proper top margin */}
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{cleanText(report['header-section']?.title || 'Client Assessment Report')} for {cleanText(firstName)}</Text>
            <Text style={styles.subtitle}>{cleanText(report['header-section']?.subtitle || 'Prepared by DreamScape AI')}</Text>
            {report['header-section']?.openingStatement && (
              <Text style={styles.openingStatement}>{cleanText(report['header-section'].openingStatement)}</Text>
            )}
          </View>

          {/* Question Sections */}
          {report['question-section'] && report['question-section'].map((question: any, index: number) => (
            <React.Fragment key={`question_${index}`}>
              {renderQuestionSection(question, `client_question_${index}`)}
              {index < report['question-section'].length - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}
          
          <SectionSeparator />
          
          {/* Highlight Sections */}
          {report['highlight-section'] && report['highlight-section'].map((highlight: any, index: number) => (
            <React.Fragment key={`highlight_${index}`}>
              {renderHighlightSection(highlight, `client_highlight_${index}`)}
              {index < report['highlight-section'].length - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}
          
          <SectionSeparator />
          
          {/* Closing Section */}
          {report['closing-section'] && report['closing-section'].map((closing: any, index: number) => (
            <View key={`closing_${index}`} style={styles.closingSection}>
              <Text>{cleanText(closing.content)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

// Generate practitioner PDF with properly structured data
export const generatePractitionerPDF = async (firstName: string, practitionerReport: any) => {
  const report = practitionerReport;
  
  const PractitionerPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top of every page */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>
        
        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />
        
        {/* Content with proper top margin */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{cleanText(report.header?.title || 'Practitioner Case Report')}: {cleanText(firstName)}</Text>
          </View>
          
          {/* Client Summary Section */}
          {report.sections && report.sections.map((section: any, index: number) => {
            if (section.type === 'section' && section.title === 'Client Summary') {
              return (
                <React.Fragment key={`summary_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={styles.sectionTitle}>{cleanText(section.title)}</Text>
                    <Text style={styles.normalText}>{cleanText(section.content)}</Text>
                    
                    {section.primaryObjective && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.subsectionTitle}>Primary Objective:</Text>
                        <Text style={styles.normalText}>{cleanText(section.primaryObjective)}</Text>
                      </View>
                    )}
                  </View>
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            return null;
          })}
          
          {/* Other Sections */}
          {report.sections && report.sections.map((section: any, index: number) => {
            if (section.type === 'section' && section.title !== 'Client Summary' && section.title !== 'Neuro Change Method™: Your 4-Phase Transformation Journey') {
              return (
                <React.Fragment key={`section_${index}`}>
                  {renderSectionWithItems(section, `prac_section_${index}`)}
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            return null;
          })}
          
          {/* Phases Section */}
          {report.sections && report.sections.map((section: any, index: number) => {
            if (section.title === 'Neuro Change Method™: Your 4-Phase Transformation Journey') {
              return (
                <React.Fragment key={`phases_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={styles.sectionTitle}>{cleanText(section.title)}</Text>
                    
                    {section.phases && section.phases.map((phase: PhaseSection, phaseIndex: number) => (
                      <React.Fragment key={`phase_${phaseIndex}`}>
                        {renderPhaseSection(phase, `prac_phase_${phaseIndex}`)}
                      </React.Fragment>
                    ))}
                  </View>
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            return null;
          })}
          
          {/* Milestones Table */}
          {report.milestones && report.milestones.length > 0 && (
            <React.Fragment>
              {renderMilestoneTable(report.milestones)}
              <SectionSeparator />
            </React.Fragment>
          )}
          
          {/* Projected Transformation Outcomes */}
          {report.projectedTransformationOutcomes && (
            <React.Fragment>
              <View style={{ marginBottom: 10 }} wrap>
                <Text style={styles.sectionTitle}>Projected Transformation Outcomes</Text>
                {report.projectedTransformationOutcomes.map((outcome: string, idx: number) => (
                  <View key={`outcome_${idx}`} style={styles.bulletRow}>
                    <Text style={styles.bulletMarker}>•</Text>
                    <Text style={styles.bulletPoint}>{cleanText(outcome)}</Text>
                  </View>
                ))}
              </View>
              <SectionSeparator />
            </React.Fragment>
          )}
          
          {/* Closing Statement */}
          {report.closingStatement && (
            <View style={styles.closingSection}>
              <Text>{cleanText(report.closingStatement)}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
}; 