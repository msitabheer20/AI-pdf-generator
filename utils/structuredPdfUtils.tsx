import { Document, Page, Text, View, StyleSheet, Image, pdf, Font } from '@react-pdf/renderer';
import React from 'react';

// Emoji source no longer needed as we're using SVG icons instead
// Font.registerEmojiSource({
//   format: 'png',
//   url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
//   withVariationSelectors: true,
// });

// Image Components that replace SVG icons
const BulbIcon = () => (
  <Image src="/assets/bulb.png" style={{ width: 16, height: 16 }} />
);

const DiamondIcon = () => (
  <Image src="/assets/diamond.png" style={{ width: 16, height: 16 }} />
);

const CalendarIcon = () => (
  <Image src="/assets/calendar.png" style={{ width: 14, height: 14 }} />
);

// Brain icon for phase sections
const BrainIcon = () => (
  <Image src="/assets/brain.png" style={{ width: 18, height: 18 }} />
);

// Compass icon for practitioner report header
const CompassIcon = () => (
  <Image src="/assets/compass.png" style={{ width: 18, height: 18 }} />
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
    // marginBottom: 5,
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  openingStatement: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 15,
    lineHeight: 1.6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
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
    width: 18,
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
    // fontStyle: 'italic',
    color: '#000000',
    padding: 10,
    borderRadius: 5,
  }
});

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
  type: string;  // 'section' | 'highlight' | 'phase' | string;
  title: string;
  content?: string;
  items?: string[];
  primaryObjective?: string;
  phases?: PhaseData[];
};

type ClientReport = {
  'question-section'?: QuestionData[];
  'highlight-section'?: HighlightData;
  'closing-section'?: Array<{ content: string }>;
  // Added for direct frontend data support
  clientResponses?: { [key: string]: string };
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
  practitionerNotes?: {
    temperament?: string;
    "best-practices"?: string[];
  };
};

// Render client response and AI insight
const renderQuestionSection = (questionData: QuestionData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <Text style={styles.questionTitle}>{parseTrademarks(questionData.title)}</Text>
    <View style={{ marginBottom: 8 }} wrap>
      <Text style={styles.boldText}>Client Response:</Text>
      <Text style={{ ...styles.italicText, marginTop: 8 }}>{parseTrademarks(questionData.clientResponse)}</Text>
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
      <>
        <Text style={{ ...styles.normalText, marginTop: 8, marginBottom: 8 }}>
          Under the care of a Certified Neuro Change Practitioner, you'll be guided through a precision-based, science-backed transformation that uses:
        </Text>
        {Object.entries(highlightData.points).map(([pointKey, pointValue], idx) => {
          // Extract the actual content if the key has a format like "•item1: "
          // Also handle any other potential prefixes or formatting
          const cleanKey = pointKey
            .replace(/^•?\s*item\d+:\s*/, '') // Remove •itemX: format
            .replace(/^•?\s*/, '')            // Remove any bullet prefix
            .replace(/:\s*$/, '');            // Remove trailing colon
          
          return (
            <View key={`${key}_point_${idx}`} style={styles.bulletRow}>
              <Text style={{ ...styles.bulletMarker, fontWeight: 'bold' }}>•</Text>
              <Text style={styles.bulletPoint}>
                <Text style={styles.boldText}>{parseTrademarks(cleanKey)}: </Text>
                {parseTrademarks(pointValue as string)}
              </Text>
            </View>
          );
        })}
        
        {/* Closing statement */}
        {highlightData.closingStatement && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ ...styles.highlightText }}>
              {parseTrademarks(highlightData.closingStatement)}
            </Text>
          </View>
        )}
      </>
    )}
  </View>
);

// Render phase section with items
const renderPhaseSection = (phaseData: PhaseData, key: string | number) => (
  <View key={key} style={{ marginBottom: 10 }} wrap>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <BrainIcon />
      <Text style={{ ...styles.phaseTitle, marginLeft: 4 }}>{parseTrademarks(phaseData.title)}</Text>
    </View>

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
export const generateClientPDF = async (firstName: string, clientReport: ClientReport, frontendResponses?: { questions: string[], responses: { [key: string]: string } }) => {
  const report = clientReport;

  // Create question data from frontend responses if provided
  let questionSection = report['question-section'];
  if (frontendResponses && frontendResponses.questions && frontendResponses.responses) {
    questionSection = frontendResponses.questions.map((question, index) => {
      const qKey = `ques${index + 1}`;
      return {
        title: question,
        clientResponse: frontendResponses.responses[qKey] || '',
        aiInsight: report['question-section']?.[index]?.aiInsight || 'Analysis in progress...'
      };
    });
  }

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
            <Text style={styles.reportTitle}>Client Assessment Report for {parseTrademarks(firstName)}</Text>
            <Text style={styles.subtitle}>Prepared by DreamScape AI</Text>
            <Text style={styles.openingStatement}>
              {parseTrademarks(firstName)}, what you're about to read isn't just a reflection—it's a revelation. This assessment draws on evidence-based psychological frameworks and cutting-edge insight tools to uncover the hidden architecture of your mindset, motivations, and identity with stunning clarity.
            </Text>
          </View>

          <SectionSeparator />

          {/* Question Sections */}
          {questionSection && questionSection.map((question: QuestionData, index: number) => (
            <React.Fragment key={`question_${index}`}>
              {renderQuestionSection(question, `client_question_${index}`)}
              {index < (questionSection?.length ?? 0) - 1 && <SectionSeparator />}
            </React.Fragment>
          ))}

          <SectionSeparator />

          {/* Highlight Section */}
          {report['highlight-section'] && (
            <React.Fragment>
              {renderHighlightSection(report['highlight-section'], 'client_highlight')}
            </React.Fragment>
          )}

          <SectionSeparator />

          {/* Fixed Closing Section */}
          <View style={styles.closingSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <DiamondIcon />
              <Text style={{ ...styles.sectionTitle, marginLeft: 4, marginBottom: 10 }}>Why Now, Why You, and Why a Neuro Change Practitioner?</Text>
            </View>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              {parseTrademarks(firstName)}, you're standing at a powerful crossroads—between where you've been and the future you're ready to claim. You don't need more inspiration—you need integration. You don't need more information—you need implementation.
              {'\n\n'}And that's where our Accredited Neuro Change Practitioners come in.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              The Neuro Change Method™ is not coaching. It's not motivational speaking. It is a scientifically grounded, evidence-based transformation framework—built on the latest research in neuroscience, cognitive psychology, and behavioral change theory.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Unlike traditional life coaches, our practitioners undergo rigorous training, accreditation, and ongoing mentorship. Their work is backed by our professional practice guidelines and validated through our Neuro Change Method™ White Paper, ensuring that every tool, every session, and every insight you receive is rooted in measurable, real-world efficacy.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              What makes this different is the precision and personalization. Working with a Neuro Change Practitioner means working with someone who is:
            </Text>
            <View style={{ marginLeft: 15, marginBottom: 10 }}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Highly trained in neuroplasticity, mindset reframing, belief engineering, and subconscious integration.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Supported by a powerful AI-enhanced framework that helps uncover the hidden dimensions of your transformation—your unconscious thought patterns, internal conflicts, and suppressed potential.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletPoint}>Focused solely on you—your identity, your values, and your outcomes.</Text>
              </View>
            </View>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              This isn't generic advice. It's scientific strategy tailored to your deepest aspirations. And it's delivered with professional care, confidentiality, and compassion.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Booking a time to speak with one of our accredited practitioners isn't just a step forward—it's a strategic move toward the most aligned, empowered, and unstoppable version of yourself.
            </Text>
            <Text style={{ ...styles.normalText, marginBottom: 10 }}>
              Are you ready to stop waiting for permission—and start building the reality that reflects who you already are?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <CalendarIcon />
              <Text style={{ marginLeft: 4, fontWeight: 'bold' }}>
                Book your complimentary 20 minute discovery session with an Accredited Neuro Change Practitioner today. Your next breakthrough isn't in the future. It's in your decision to act now.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  return await pdf(ClientPDF).toBlob();
};

// Generate practitioner PDF with properly structured data
export const generatePractitionerPDF = async (firstName: string, practitionerReport: PractitionerReport) => {
  const report = practitionerReport;

  // Check if there are highlight sections in the report structure
  const hasHighlights = report.sections?.some(section => 
    section.title && section.title.toLowerCase().includes('highlight')
  );

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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <CompassIcon />
              <Text style={{ ...styles.reportTitle, marginLeft: 4 }}>Practitioner Case Report : {parseTrademarks(firstName)}</Text>
            </View>
          </View>

          {/* Client Summary Section */}
          {report.sections && report.sections.map((section: SectionData, sectionIndex: number) => {
            if (section.title === 'Client Summary') {
              return (
                <React.Fragment key={`summary_section`}>
                  <View style={{ marginBottom: 10 }} wrap>
                    <Text style={styles.sectionTitle}>Client Profile Summary</Text>
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
            
            // Check if this is a highlight section and use alternating icons
            if (section.title && section.title.toLowerCase().includes('highlight')) {
              const highlightData: HighlightData = {
                title: section.title,
                content: section.content || '',
                points: section.items?.reduce((obj, item, i) => {
                  obj[`Point ${i+1}`] = item;
                  return obj;
                }, {} as Record<string, string>)
              };
              
              return (
                <React.Fragment key={`highlight_section_${sectionIndex}`}>
                  {renderHighlightSection(highlightData, `prac_highlight_${sectionIndex}`)}
                  <SectionSeparator />
                </React.Fragment>
              );
            }
            
            return null;
          })}

          {/* Practitioner Notes Section */}
          {report.practitionerNotes && (
            <React.Fragment>
              <View style={{ marginBottom: 15 }} wrap>
                <Text style={styles.sectionTitle}>Practitioner Notes</Text>
                
                {report.practitionerNotes.temperament && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subsectionTitle}>Client Temperament:</Text>
                    <Text style={styles.normalText}>{parseTrademarks(report.practitionerNotes.temperament)}</Text>
                  </View>
                )}
                
                {report.practitionerNotes["best-practices"] && report.practitionerNotes["best-practices"].length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.subsectionTitle}>Best Practices for This Client:</Text>
                    {report.practitionerNotes["best-practices"].map((practice: string, idx: number) => (
                      <View key={`practice_${idx}`} style={styles.bulletRow}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.bulletPoint}>{parseTrademarks(practice)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <SectionSeparator />
            </React.Fragment>
          )}

          {/* Other Sections */}
          {report.sections && report.sections.map((section: SectionData, sectionIndex: number) => {
            if (section.title !== 'Client Summary' && 
                section.title !== 'Neuro Change Method™: Your 4-Phase Transformation Journey' &&
                !(section.title && section.title.toLowerCase().includes('highlight'))) {
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