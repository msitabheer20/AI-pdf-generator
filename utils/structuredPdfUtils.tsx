import { Document, Page, Text, View, StyleSheet, Image, pdf, Font, Svg, Path } from '@react-pdf/renderer';
import React from 'react';

// Emoji source no longer needed as we're using SVG icons instead
// Font.registerEmojiSource({
//   format: 'png',
//   url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
//   withVariationSelectors: true,
// });


// SVG Icon Components
const BulbIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path
      fill="#F1C40F"
      d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm-1 14h2v1h-2v-1zm0-2h2v1h-2v-1zm1-11c2.76 0 5 2.24 5 5 0 2.05-1.23 3.81-3 4.58V11h-4v1.58c-1.77-.77-3-2.53-3-4.58 0-2.76 2.24-5 5-5z"
    />
  </Svg>
);

const DiamondIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      fill="#3498DB"
      d="M12 2L2 12l10 10 10-10L12 2zm0 15.5L5.5 12 12 5.5l6.5 6.5-6.5 6.5z"
    />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path
      fill="#27AE60"
      d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
    />
  </Svg>
);

// Improved styles with better structure
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
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
    height: 240,
  },
  contentContainer: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  instituteTagline: {
    fontSize: 11,
    color: '#000000',
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  openingStatement: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 20,
    lineHeight: 1.6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 6,
    color: '#000000',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 5,
    color: '#000000',
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#000000',
  },
  normalText: {
    fontSize: 12,
    // lineHeight: 1.6,
    marginBottom: 10,
    color: '#000000',
  },
  boldText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  italicText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#000000',
  },
  bulletPoint: {
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 1.6,
    color: '#000000',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  bulletMarker: {
    width: 15,
    fontSize: 16,
  },
  highlightBox: {
    // backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  highlightText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
  },
  transformationSection: {
    backgroundColor: '#f5f0ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  phaseItem: {
    marginLeft: 15,
    fontSize: 12,
    lineHeight: 1.6,
    marginBottom: 3,
    color: '#000000',
  },
  phaseContent: {
    marginLeft: 15,
    fontSize: 12,
    color: '#000000',
    lineHeight: 1.6,
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
    backgroundColor: '#E5E5E5',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    padding: 4,
    color: '#000000',
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    padding: 4,
    color: '#000000',
  },
  titleContainer: {
    marginBottom: 20,
    paddingBottom: 5,
    // borderBottom: '1px solid #EEEEEE',
  },
  sectionSeparator: {
    borderBottom: '1px solid #7d7c7c',
    marginVertical: 15,
    width: '100%',
  },
  closingSection: {
    marginTop: 15,
    fontSize: 12,
    lineHeight: 1.6,
    fontStyle: 'italic',
    color: '#000000',
    padding: 10,
    borderRadius: 5,
  }
});

// Custom Page component with banner
// const PageWithBanner = ({ children }: { children: React.ReactNode }) => (
//   <Page size="A4" style={styles.page} wrap>
//     {/* Fixed banner that will appear on all pages at the same position */}
//     <View style={styles.fullWidthBanner} fixed>
//       <Image
//         src="/banner.png"
//         style={styles.bannerImage}
//         cache={false}
//       />
//     </View>

//     {/* Fixed empty header to ensure consistent spacing on all pages */}
//     <View style={styles.fixedHeader} fixed>
//       {/* This empty fixed view ensures banner space is reserved on all pages */}
//     </View>

//     {/* Content that will flow across pages with consistent spacing */}
//     <View style={styles.contentContainer}>
//       {children}
//     </View>
//   </Page>
// );

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
    .replace(/&trade;/g, "™")
    .replace(/&reg;/g, "®")
    .replace(/&copy;/g, "©")
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
        case '∞': return 'infinity';
        case '±': return '+/-';
        case '≤': return '<=';
        case '≥': return '>=';
        case '÷': return '/';
        case '×': return 'x';
        default: return ' '; // Replace unknown special characters with a space
      }
    });
};

// Section separator component
const SectionSeparator = () => (
  <View style={styles.sectionSeparator} />
);

// Types for structured data
// type ContentType =
//   | 'section'
//   | 'question'
//   | 'subsection'
//   | 'bullet'
//   | 'highlight'
//   | 'phase'
//   | 'normal'
//   | 'clientResponse'
//   | 'aiInsight'
//   | 'closing';

// type ContentSection = {
//   type: ContentType;
//   title?: string;
//   content?: string;
//   items?: string[];
//   points?: Record<string, string>;
// };

// type PhaseItem = {
//   focus?: string;
//   tools?: string;
//   goal?: string;
// };

// type PhaseSection = {
//   type: string;
//   title: string;
//   items: PhaseItem;
// };

type MilestoneItem = {
  milestone: string;
  targetWeek: string;
  toolsAndFocus: string;
};

// Type definitions
type QuestionData = {
  title: string;
  clientResponse: string;
  aiInsight: string;
};

type HighlightData = {
  title: string;
  content: string;
  points?: Record<string, string>;
  closingStatement?: string;
};

type PhaseData = {
  title: string;
  items: {
    focus?: string;
    tools?: string;
    goal?: string;
  };
};

type SectionData = {
  type: string;
  title: string;
  content?: string;
  items?: string[];
  primaryObjective?: string;
  phases?: PhaseData[];
};

type ClientReport = {
  'header-section'?: {
    title?: string;
    subtitle?: string;
    openingStatement?: string;
  };
  'question-section'?: QuestionData[];
  'highlight-section'?: HighlightData[];
  'closing-section'?: Array<{ content: string }>;
};

type PractitionerReport = {
  header?: {
    title?: string;
  };
  sections?: Array<{
    type: string;
    title: string;
    content?: string;
    primaryObjective?: string;
    phases?: PhaseData[];
  }>;
  milestones?: Array<{
    milestone: string;
    targetWeek: string;
    toolsAndFocus: string;
  }>;
  projectedTransformationOutcomes?: string[];
  closingStatement?: string;
};

// Render client response and AI insight
const renderQuestionSection = (questionData: QuestionData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.questionTitle}>{parseTrademarks(questionData.title)}</Text>
    <View style={{ marginBottom: 8 }} wrap>
      <Text>
        <Text style={styles.boldText}>Client Response: </Text>
        <Text style={styles.italicText}>{parseTrademarks(questionData.clientResponse)}</Text>
      </Text>
    </View>
    <View style={{ marginBottom: 8 }} wrap>
      <Text style={styles.subsectionTitle}>DreamScape AI Reflection:</Text>
      <Text style={styles.normalText}>{parseTrademarks(questionData.aiInsight)}</Text>
    </View>
  </View>
);

// Render highlight section with points
const renderHighlightSection = (highlightData: HighlightData, key: string | number) => (
  <View key={key} style={styles.highlightBox} wrap>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <BulbIcon />
      <Text style={{ ...styles.highlightTitle, marginLeft: 4 }}>{parseTrademarks(highlightData.title)}</Text>
    </View>
    <Text style={styles.highlightText}>{parseTrademarks(highlightData.content)}</Text>

    {highlightData.points && (
      Array.isArray(highlightData.points) ? (
        highlightData.points.map((point: string, idx: number) => (
          <View key={`${key}_point_${idx}`} style={styles.bulletRow}>
            <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
            <Text style={styles.bulletPoint}>{parseTrademarks(point)}</Text>
          </View>
        ))
      ) : (
        <>
          {Object.entries(highlightData.points).map(([pointKey, pointValue], idx) => (
            <View key={`${key}_point_${idx}`} style={styles.bulletRow}>
              <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
              <Text style={styles.bulletPoint}>
                <Text style={styles.boldText}>{parseTrademarks(pointKey)}: </Text>
                {parseTrademarks(pointValue as string)}
              </Text>
            </View>
          ))}
          
          {/* Only display closing statement when points is an object */}
          {highlightData.closingStatement && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ ...styles.highlightText, fontStyle: 'italic' }}>
                {parseTrademarks(highlightData.closingStatement)}
              </Text>
            </View>
          )}
        </>
      )
    )}
  </View>
);

// Render phase section with items
const renderPhaseSection = (phaseData: PhaseData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.phaseTitle}>{parseTrademarks(phaseData.title)}</Text>

    {phaseData.items && (
      <View style={{ marginLeft: 15 }}>
        {phaseData.items.focus && (
          <Text style={styles.phaseItem}>
            <Text style={{ ...styles.boldText, color: '#333333' }}>Focus: </Text>
            {parseTrademarks(phaseData.items.focus)}
          </Text>
        )}
        {phaseData.items.tools && (
          <Text style={styles.phaseItem}>
            <Text style={{ ...styles.boldText, color: '#333333' }}>Tools: </Text>
            {parseTrademarks(phaseData.items.tools)}
          </Text>
        )}
        {phaseData.items.goal && (
          <Text style={styles.phaseItem}>
            <Text style={{ ...styles.boldText, color: '#333333' }}>Goal: </Text>
            {parseTrademarks(phaseData.items.goal)}
          </Text>
        )}
      </View>
    )}
  </View>
);

// Render section with items (bullet points)
const renderSectionWithItems = (sectionData: SectionData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.sectionTitle}>{parseTrademarks(sectionData.title)}</Text>
    {sectionData.content && <Text style={styles.normalText}>{parseTrademarks(sectionData.content)}</Text>}

    {sectionData.items && sectionData.items.map((item: string, idx: number) => (
      <View key={`${key}_item_${idx}`} style={styles.bulletRow}>
        <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
        <Text style={styles.bulletPoint}>{parseTrademarks(item)}</Text>
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
        <Text style={styles.tableCell}>{parseTrademarks(milestone.milestone)}</Text>
        <Text style={styles.tableCell}>{parseTrademarks(milestone.targetWeek)}</Text>
        <Text style={styles.tableCell}>{parseTrademarks(milestone.toolsAndFocus)}</Text>
      </View>
    ))}
  </View>
);

// Trademark component
const Trademark = () => (
  <Text style={{ 
    fontSize: 8, 
    verticalAlign: 'super', 
    position: 'relative', 
    top: -5,
    fontFamily: 'Times-Roman',
    fontWeight: 'bold'
  }}>TM</Text>
);

// Registered trademark component
const RegisteredTrademark = () => (
  <Text style={{ 
    fontSize: 8, 
    verticalAlign: 'super', 
    position: 'relative', 
    top: -5,
    fontFamily: 'Times-Roman',
    fontWeight: 'bold'
  }}>®</Text>
);

// Custom parse function to handle trademark and registered trademark symbols
const parseTrademarks = (text: string) => {
  if (!text) return null;
  
  // Clean the text first
  const cleaned = cleanText(text);
  
  // Look for trademark symbols
  if (!cleaned.includes('TM') && !cleaned.includes('(R)')) {
    return <Text>{cleaned}</Text>;
  }
  
  // Split the text at trademark/registered symbols
  const parts = cleaned.split(/(TM|\(R\))/g);
  
  return (
    <Text>
      {parts.map((part, index) => {
        if (part === 'TM') {
          return <Trademark key={index} />;
        } else if (part === '(R)') {
          return <RegisteredTrademark key={index} />;
        } else {
          return part;
        }
      })}
    </Text>
  );
};

// Generate client PDF with properly structured data
export const generateClientPDF = async (firstName: string, clientReport: ClientReport) => {
  const report = clientReport;

  const ClientPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner1.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>

        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{parseTrademarks(report['header-section']?.title || 'Client Assessment Report')} for {parseTrademarks(firstName)}</Text>
            <Text style={styles.subtitle}>{parseTrademarks(report['header-section']?.subtitle || 'Prepared by DreamScape AI')}</Text>
            {report['header-section']?.openingStatement && (
              <Text style={styles.openingStatement}>{parseTrademarks(report['header-section'].openingStatement)}</Text>
            )}
          </View>

          <SectionSeparator />

          {/* Question Sections */}
          {report['question-section'] && report['question-section'].map((question: QuestionData, index: number) => (
            <React.Fragment key={`question_${index}`}>
              {renderQuestionSection(question, `client_question_${index}`)}
              {index < (report['question-section']?.length ?? 0) - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}

          <SectionSeparator />

          {/* Highlight Sections */}
          {report['highlight-section'] && report['highlight-section'].map((highlight: HighlightData, index: number) => (
            <React.Fragment key={`highlight_${index}`}>
              {renderHighlightSection(highlight, `client_highlight_${index}`)}
              {index < (report['highlight-section']?.length ?? 0) - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}

          <SectionSeparator />

          {/* Closing Section */}
          {report['closing-section'] && report['closing-section'].map((closing: { content: string }, index: number) => (
            <View key={`closing_${index}`} style={styles.closingSection}>
              {/* <View style={{ flexDirection: 'row',  alignItems: 'center' }}> */}
                <CalendarIcon />
                <Text style={{ marginLeft: 4 }}>{parseTrademarks(closing.content)}</Text>
              {/* </View> */}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

// Generate practitioner PDF with properly structured data
export const generatePractitionerPDF = async (firstName: string, practitionerReport: PractitionerReport) => {
  const report = practitionerReport;

  const PractitionerPDF = (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Fixed banner at the top of every page */}
        <View style={styles.fullWidthBanner} fixed>
          <Image
            src="/banner1.png"
            style={styles.bannerImage}
            cache={false}
          />
        </View>

        {/* Fixed header space to maintain consistent spacing on all pages */}
        <View style={styles.fixedHeader} fixed />

        {/* Content container */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{parseTrademarks(report.header?.title || 'Practitioner Case Report')}: {parseTrademarks(firstName)}</Text>
          </View>

          {/* Client Summary Section */}
          {report.sections && report.sections.map((section: SectionData) => {
            if (section.type === 'section' && section.title === 'Client Summary') {
              return (
                <React.Fragment key={`summary_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={styles.sectionTitle}>{parseTrademarks(section.title)}</Text>
                    {section.content && <Text style={styles.normalText}>{parseTrademarks(section.content)}</Text>}

                    {section.primaryObjective && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={styles.subsectionTitle}>Primary Objective:</Text>
                        <Text style={styles.normalText}>{parseTrademarks(section.primaryObjective)}</Text>
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
          {report.sections && report.sections.map((section: SectionData) => {
            if (section.type === 'section' && section.title !== 'Client Summary' && section.title !== 'Neuro Change Method™: Your 4-Phase Transformation Journey') {
              return (
                <React.Fragment key={`section_${section.title}`}>
                  {renderSectionWithItems(section, `prac_section_${section.title}`)}
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            return null;
          })}

          {/* Phases Section */}
          {report.sections && report.sections.map((section: SectionData) => {
            if (section.title === 'Neuro Change Method™: Your 4-Phase Transformation Journey') {
              return (
                <React.Fragment key={`phases_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={styles.sectionTitle}>{parseTrademarks(section.title)}</Text>

                    {section.phases && section.phases.map((phase: PhaseData, phaseIndex: number) => (
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
                    <Text style={styles.bulletPoint}>{parseTrademarks(outcome)}</Text>
                  </View>
                ))}
              </View>
              <SectionSeparator />
            </React.Fragment>
          )}

          {/* Closing Statement */}
          {report.closingStatement && (
            <View style={styles.closingSection}>
              <Text>{parseTrademarks(report.closingStatement)}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  return await pdf(PractitionerPDF).toBlob();
}; 