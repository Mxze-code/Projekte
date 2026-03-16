/**
 * SEDUCTIVE TYPES DATA - The Art of Seduction by Robert Greene
 *
 * This site presents the book as literary and cultural analysis—a study of
 * charm, attraction, theatricality, persona, desire, and human psychology.
 * Content is framed analytically and reflectively, not as manipulation advice.
 *
 * Each type has: id, slug, title, summary, traits, emotionalEffect, whyAttracts,
 * strengths, risks, culturalInterpretation, reflectionPrompt
 */

const SEDUCTIVE_TYPES_DATA = [
    { id: 1, slug: 'siren', title: 'The Siren',
        summary: 'A figure of intense sensual presence who embodies adventure and transformation. The Siren operates through theatrical charm, glamour, and the activation of primal desire—not as instruction, but as a cultural archetype worth understanding.',
        traits: ['Sensual presence', 'Theatrical self-presentation', 'Glamour and mystery', 'Embodies change and adventure'],
        emotionalEffect: 'Activates desire for the exotic, the transformative, the escape from the ordinary.',
        whyAttracts: 'The Siren represents a fantasy of intensity—of being swept away from routine into something more vivid.',
        strengths: 'Charisma, presence, the ability to hold attention. Historically, figures who embodied this archetype often commanded fascination.',
        risks: 'The shadow side: objectification, the trap of performance, the cost of maintaining the mask. Understanding the type includes understanding its psychological costs.',
        culturalInterpretation: 'From Cleopatra to screen icons, the Siren appears across history as a figure of fascination. The archetype reflects cultural ideas about desire, danger, and transformation.',
        reflectionPrompt: 'Where do you see the Siren archetype in culture? What does it reveal about how desire and fascination work?'
    },
    { id: 2, slug: 'rake', title: 'The Rake',
        summary: 'A figure of ardent pursuit and unabashed passion. The Rake cultivates intensity, devotion, and a hint of danger. Greene presents this as a male archetype historically, though the pattern—focused pursuit, emotional intensity—appears across gender.',
        traits: ['Ardent devotion', 'Unabashed passion', 'Strategic mystery', 'Reputation as a pursuer'],
        emotionalEffect: 'Activates the fantasy of being intensely desired, of being the object of singular focus.',
        whyAttracts: 'The Rake offers the thrill of being chosen, pursued, and made to feel extraordinary.',
        strengths: 'Capacity for intensity, the ability to make others feel desired. The archetype taps into a deep human need for attention and validation.',
        risks: 'The shadow: obsession, possessiveness, the line between passion and pressure. The archetype can tip into toxicity when pursued without awareness.',
        culturalInterpretation: 'From Casanova to romantic literature, the Rake is a recurring figure. The archetype reveals how pursuit and intensity function in the psychology of attraction.',
        reflectionPrompt: 'What is the difference between passionate pursuit and pressure? How does culture romanticize or caution against this archetype?'
    },
    { id: 3, slug: 'ideal-lover', title: 'The Ideal Lover',
        summary: 'A figure who embodies the fantasy of the perfect match—the one who seems to complete you. The Ideal Lover reflects back what the other desires, becoming a mirror for projection.',
        traits: ['Reflects desire', 'Embodies the fantasy', 'Adaptability', 'Sensitivity to the other'],
        emotionalEffect: 'Activates the fantasy of being understood, of finding the one who \"gets\" you.',
        whyAttracts: 'We project our ideals onto others. The Ideal Lover is skilled at receiving and reflecting that projection.',
        strengths: 'Empathy, attunement, the ability to make others feel seen. The archetype speaks to the human need for recognition.',
        risks: 'The shadow: losing oneself in the role, the collapse when projection fails, the exhaustion of constant attunement.',
        culturalInterpretation: 'Romantic literature is full of ideal lovers. The archetype reveals how projection and fantasy shape attraction.',
        reflectionPrompt: 'When have you idealized someone? What were you projecting—and what happened when reality intruded?'
    },
    { id: 4, slug: 'dandy', title: 'The Dandy',
        summary: 'A figure of refined aestheticism and ironic detachment. The Dandy cultivates style, wit, and the appearance of being above ordinary concerns. Attraction flows from the sense of exclusivity and sophistication.',
        traits: ['Refined style', 'Aesthetic sensibility', 'Ironic detachment', 'Exclusivity'],
        emotionalEffect: 'Activates the fantasy of sophistication, of belonging to a refined world.',
        whyAttracts: 'The Dandy offers access to a rarefied realm—style, wit, the sense of being chosen by someone discerning.',
        strengths: 'Cultural capital, the power of taste, the ability to create an aura of exclusivity.',
        risks: 'The shadow: emptiness behind the pose, the trap of performance, the isolation of perpetual irony.',
        culturalInterpretation: 'From Oscar Wilde to modern aesthetics, the Dandy represents a tradition of style as identity. The archetype reveals how presentation and exclusivity create fascination.',
        reflectionPrompt: 'What role does aesthetic refinement play in attraction? Where does style become substance—or mask its absence?'
    },
    { id: 5, slug: 'natural', title: 'The Natural',
        summary: 'A figure of apparent spontaneity and unaffected charm. The Natural seems to lack calculation—which is itself a form of appeal. Innocence, or its performance, disarms.',
        traits: ['Apparent spontaneity', 'Unaffected manner', 'Innocence or its performance', 'Disarming quality'],
        emotionalEffect: 'Activates the fantasy of authenticity, of connection unmediated by social performance.',
        whyAttracts: 'In a world of calculation, the Natural seems to offer something real. The contrast creates appeal.',
        strengths: 'Disarming quality, the power of seeming uncalculated, the appeal of \"realness.\"',
        risks: 'The shadow: the Natural may be as performed as any other type. The fantasy of authenticity can blind us to manipulation.',
        culturalInterpretation: 'The Natural appears in pastoral romance, in the myth of the unspoiled. The archetype reveals our longing for pre-performance authenticity.',
        reflectionPrompt: 'Is \"natural\" charm ever truly uncalculated? What do we seek when we value authenticity?'
    },
    { id: 6, slug: 'coquette', title: 'The Coquette',
        summary: 'A figure who creates desire through withholding and ambiguity. The Coquette never fully gives—and that very resistance fuels fascination. The dynamic is one of tension and delayed gratification.',
        traits: ['Strategic withholding', 'Ambiguity', 'Playful resistance', 'Control through delay'],
        emotionalEffect: 'Activates the fantasy of the chase, of winning what is hard to get.',
        whyAttracts: 'What is withheld becomes more desirable. The Coquette understands the psychology of scarcity.',
        strengths: 'The power of ambiguity, the ability to sustain attention through tension, the appeal of the unconquered.',
        risks: 'The shadow: the line between play and cruelty, the exhaustion of perpetual games, the cost of never fully engaging.',
        culturalInterpretation: 'The Coquette is a classic figure in literature and film. The archetype reveals how desire is structured by absence and possibility.',
        reflectionPrompt: 'What is the difference between playful ambiguity and emotional withholding? When does the chase become exploitation?'
    },
    { id: 7, slug: 'charmer', title: 'The Charmer',
        summary: 'A figure who disarms through warmth, attentiveness, and the ability to make others feel good. The Charmer creates connection through emotional generosity and social skill.',
        traits: ['Warmth', 'Attentiveness', 'Emotional generosity', 'Social fluency'],
        emotionalEffect: 'Activates the fantasy of being valued, of feeling good in another\'s presence.',
        whyAttracts: 'The Charmer offers the gift of attention—of feeling interesting, important, seen.',
        strengths: 'The power of making others feel good, the social capital of warmth, the ability to create rapport.',
        risks: 'The shadow: charm can mask emptiness; warmth can be strategic. The Charmer may give to receive.',
        culturalInterpretation: 'Charm is a form of social capital. The archetype reveals how emotional labor and attentiveness function in attraction.',
        reflectionPrompt: 'When is charm genuine and when is it performance? What do we owe to those who make us feel good?'
    },
    { id: 8, slug: 'charismatic', title: 'The Charismatic',
        summary: 'A figure of magnetic presence and visionary energy. The Charismatic draws others through the force of personality and the promise of transformation. They offer a cause, a mission, or a new identity.',
        traits: ['Magnetic presence', 'Visionary energy', 'Cause or mission', 'Identity offer'],
        emotionalEffect: 'Activates the fantasy of belonging to something larger, of being transformed by contact with greatness.',
        whyAttracts: 'The Charismatic offers meaning—a sense that life could be more significant in their orbit.',
        strengths: 'The power to inspire, to mobilize, to offer identity. Charisma is a form of influence.',
        risks: 'The shadow: the cult of personality, the danger of surrendering judgment, the exploitation of devotion.',
        culturalInterpretation: 'From political leaders to spiritual figures, charisma has shaped history. The archetype reveals how personality and cause create followership.',
        reflectionPrompt: 'What is the line between inspiration and manipulation? When does charisma become dangerous?'
    },
    { id: 9, slug: 'star', title: 'The Star',
        summary: 'A figure who radiates glamour and larger-than-life presence. The Star exists in the realm of fantasy—unattainable yet fascinating. Distance and fame amplify desire.',
        traits: ['Glamour', 'Larger-than-life presence', 'Distance', 'Fame or renown'],
        emotionalEffect: 'Activates the fantasy of the extraordinary, of touching something beyond the ordinary.',
        whyAttracts: 'The Star offers the thrill of proximity to greatness—even secondhand. We live through their glow.',
        strengths: 'The power of distance, the appeal of the unattainable, the magnetism of fame.',
        risks: 'The shadow: the Star is often a construction. The fantasy can obscure the human behind the image.',
        culturalInterpretation: 'Celebrity culture is built on the Star archetype. The figure reveals how distance and renown create fascination.',
        reflectionPrompt: 'Why do we desire what we cannot have? What does the Star archetype reveal about fame and fantasy?'
    }
];
