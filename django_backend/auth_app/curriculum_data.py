from django.http import JsonResponse

# Static curriculum structure - can be moved to database later
CURRICULUM_STRUCTURE = {
    "CBSE": {
        "10": {
            "Mathematics": {
                "Real Numbers": ["Euclid's Division Lemma", "Fundamental Theorem of Arithmetic", "Irrational Numbers", "Rational Numbers and Decimal Expansions"],
                "Polynomials": ["Introduction to Polynomials", "Geometrical Meaning of Zeroes", "Relationship between Zeroes and Coefficients", "Division Algorithm"],
                "Pair of Linear Equations in Two Variables": ["Linear Equations", "Graphical Method", "Algebraic Methods", "Applications"],
                "Quadratic Equations": ["Introduction", "Solution by Factorisation", "Completing the Square", "Nature of Roots"],
                "Arithmetic Progressions": ["Introduction to AP", "nth Term of an AP", "Sum of First n Terms", "Applications"]
            },
            "Science": {
                "Light - Reflection and Refraction": ["Reflection of Light", "Spherical Mirrors", "Refraction of Light", "Lenses"],
                "Human Eye and Colourful World": ["Human Eye", "Defects of Vision", "Refraction through Prism", "Atmospheric Refraction"],
                "Electricity": ["Electric Current and Circuit", "Potential and Potential Difference", "Circuit Diagram", "Ohm's Law"],
                "Life Processes": ["Life Processes", "Nutrition", "Respiration", "Transportation", "Excretion"],
                "Control and Coordination": ["Animals - Nervous System", "Coordination in Plants", "Hormones in Animals"]
            }
        },
        "11": {
            "Chemistry": {
                "Some Basic Concepts of Chemistry": ["Importance of Chemistry", "Nature of Matter", "Laws of Chemical Combination", "Dalton's Atomic Theory", "Atomic and Molecular Masses", "Mole Concept"],
                "Structure of Atom": ["Discovery of Electron", "Atomic Models", "Bohr's Model", "Quantum Mechanical Model", "Quantum Numbers", "Electronic Configuration"],
                "Classification of Elements and Periodicity": ["Genesis of Periodic Classification", "Modern Periodic Law", "Nomenclature of Elements", "Electronic Configurations and Types of Elements"],
                "Chemical Bonding and Molecular Structure": ["Kossel-Lewis Approach", "Ionic Bond", "Bond Parameters", "Covalent Bond", "Coordinate Bond", "Molecular Orbital Theory"],
                "States of Matter": ["Intermolecular Forces", "Thermal Energy", "Gaseous State", "Liquid State", "Solid State"]
            },
            "Physics": {
                "Physical World": ["What is Physics", "Scope and Excitement of Physics", "Physics, Technology and Society", "Fundamental Forces in Nature"],
                "Units and Measurements": ["Introduction", "International System of Units", "Measurement of Length", "Measurement of Mass", "Measurement of Time", "Accuracy and Precision"],
                "Motion in a Straight Line": ["Introduction", "Position, Path Length and Displacement", "Average Velocity and Average Speed", "Instantaneous Velocity and Speed", "Acceleration"],
                "Motion in a Plane": ["Introduction", "Scalars and Vectors", "Multiplication of Vectors by Real Numbers", "Addition and Subtraction of Vectors", "Resolution of Vectors"]
            },
            "Mathematics": {
                "Sets": ["Introduction", "Sets and their Representations", "The Empty Set", "Finite and Infinite Sets", "Equal Sets", "Subsets", "Power Set", "Universal Set"],
                "Relations and Functions": ["Introduction", "Cartesian Product of Sets", "Relations", "Functions"],
                "Trigonometric Functions": ["Introduction", "Angles", "Trigonometric Functions", "Trigonometric Functions of Sum and Difference of Two Angles"],
                "Principle of Mathematical Induction": ["Introduction", "Motivation", "The Principle of Mathematical Induction"]
            }
        },
        "12": {
            "Chemistry": {
                "Solid State": ["General Characteristics of Solid State", "Amorphous and Crystalline Solids", "Classification of Crystalline Solids", "Crystal Lattices and Unit Cells"],
                "Solutions": ["Types of Solutions", "Expressing Concentration of Solutions", "Solubility", "Vapour Pressure of Liquid Solutions", "Colligative Properties"],
                "Electrochemistry": ["Electrochemical Cells", "Galvanic Cells", "Nernst Equation", "Conductance of Electrolytic Solutions", "Electrolytic Cells and Electrolysis"],
                "Chemical Kinetics": ["Rate of a Chemical Reaction", "Factors Influencing Rate of a Reaction", "Integrated Rate Equations", "Temperature Dependence of the Rate of a Reaction"]
            },
            "Physics": {
                "Electric Charges and Fields": ["Introduction", "Electric Charge", "Conductors and Insulators", "Charging by Induction", "Basic Properties of Electric Charge", "Coulomb's Law"],
                "Electrostatic Potential and Capacitance": ["Introduction", "Electrostatic Potential", "Potential due to a Point Charge", "Potential due to an Electric Dipole", "Potential due to a System of Charges"],
                "Current Electricity": ["Introduction", "Electric Current", "Electric Currents in Conductors", "Ohm's Law", "Drift of Electrons and the Origin of Resistivity"],
                "Moving Charges and Magnetism": ["Introduction", "Magnetic Force", "Motion in a Magnetic Field", "Motion in Combined Electric and Magnetic Fields"]
            }
        }
    },
    "ICSE": {
        "10": {
            "Mathematics": {
                "Commercial Mathematics": ["Compound Interest", "Income Tax", "Banking", "Shares and Dividends"],
                "Algebra": ["Factor Theorem", "Matrices", "Arithmetic Progression", "Geometric Progression"],
                "Geometry": ["Similarity", "Loci", "Circles", "Constructions"],
                "Mensuration": ["Cylinder, Cone and Sphere", "Surface Area and Volume"]
            },
            "Physics": {
                "Force": ["Turning Effect of Forces", "Equilibrium of Forces", "Centre of Gravity", "Toppling"],
                "Light": ["Reflection of Light", "Refraction of Light through a Glass Block", "Refraction through a Lens", "Spectrum"],
                "Sound": ["Vibrations", "Propagation of Sound Waves", "Natural Vibrations", "Forced Vibrations and Resonance"]
            },
            "Chemistry": {
                "Periodic Properties and Variations of Properties": ["Periodic Table", "Periodic Properties", "Chemical Families"],
                "Chemical Bonding": ["Electrovalent Bonding", "Covalent Bonding", "Coordinate Bonding"],
                "Study of Acids, Bases and Salts": ["Acids", "Bases", "Indicators", "Reactions of Acids", "Salts"]
            }
        },
        "11": {
            "Chemistry": {
                "Atomic Structure": ["Bohr Model of Atom", "Quantum Numbers", "Electronic Configuration", "Aufbau Principle"],
                "Chemical Bonding": ["Ionic Bonds", "Covalent Bonds", "Coordinate Bonds", "Metallic Bonds", "Intermolecular Forces"],
                "States of Matter": ["Gaseous State", "Kinetic Theory of Gases", "Liquid State", "Solid State"]
            },
            "Physics": {
                "Measurements and Experimentation": ["Units and Measurements", "Errors in Measurement", "Significant Figures"],
                "Kinematics": ["Motion in One Dimension", "Motion in Two Dimensions", "Projectile Motion"],
                "Dynamics": ["Newton's Laws of Motion", "Friction", "Circular Motion", "Work, Energy and Power"]
            },
            "Mathematics": {
                "Sets and Functions": ["Set Theory", "Relations", "Functions", "Inverse Functions"],
                "Algebra": ["Polynomials", "Linear Inequalities", "Quadratic Equations", "Sequences and Series"],
                "Trigonometry": ["Basic Trigonometric Ratios", "Trigonometric Identities", "Trigonometric Equations"]
            }
        },
        "12": {
            "Chemistry": {
                "Organic Chemistry": ["Hydrocarbons", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids"],
                "Physical Chemistry": ["Thermodynamics", "Chemical Kinetics", "Equilibrium", "Electrochemistry"]
            },
            "Physics": {
                "Electromagnetism": ["Electric Field and Potential", "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction"],
                "Modern Physics": ["Atomic Structure", "Nuclear Physics", "Quantum Mechanics", "Electronics"]
            }
        }
    },
    "State Board": {
        "10": {
            "Mathematics": {
                "Number Systems": ["Real Numbers", "Irrational Numbers", "Surds", "Indices"],
                "Algebra": ["Linear Equations", "Quadratic Equations", "Arithmetic Progression", "Coordinate Geometry"],
                "Geometry": ["Similarity of Triangles", "Circles", "Constructions", "Areas and Perimeters"],
                "Statistics and Probability": ["Statistics", "Probability", "Data Handling"]
            },
            "Science": {
                "Physics": ["Light", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy"],
                "Chemistry": ["Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds"],
                "Biology": ["Life Processes", "Control and Coordination", "Reproduction", "Heredity and Evolution"]
            }
        }
    }
}

def get_curriculum_structure(request):
    """Get complete curriculum structure"""
    return JsonResponse({"curriculum": CURRICULUM_STRUCTURE})

def test_chapters(request):
    """Test endpoint for chapters"""
    return JsonResponse({
        "message": "Chapters API is working",
        "sample_chapters": list(CURRICULUM_STRUCTURE["CBSE"]["11"]["Chemistry"].keys())
    })

def get_chapters(request, board, class_level, subject):
    """Get chapters for specific board, class, and subject"""
    try:
        print(f"Getting chapters for: {board}/{class_level}/{subject}")
        
        # Normalize inputs
        board = board.replace('%20', ' ').strip()
        class_level = class_level.strip()
        subject = subject.replace('%20', ' ').strip()
        
        board_data = CURRICULUM_STRUCTURE.get(board, {})
        print(f"Board data: {list(board_data.keys())}")
        
        class_data = board_data.get(class_level, {})
        print(f"Class data: {list(class_data.keys())}")
        
        subject_data = class_data.get(subject, {})
        print(f"Subject data: {list(subject_data.keys())}")
        
        chapters = list(subject_data.keys())
        print(f"Chapters found: {chapters}")
        
        return JsonResponse({
            "chapters": chapters,
            "board": board,
            "class_level": class_level,
            "subject": subject
        })
    except Exception as e:
        print(f"Error getting chapters: {e}")
        return JsonResponse({"chapters": [], "error": str(e)})

def get_lessons(request, board, class_level, subject, chapter):
    """Get lessons for specific chapter"""
    try:
        print(f"Getting lessons for: {board}/{class_level}/{subject}/{chapter}")
        
        # Normalize inputs
        board = board.replace('%20', ' ').strip()
        class_level = class_level.strip()
        subject = subject.replace('%20', ' ').strip()
        chapter = chapter.replace('%20', ' ').strip()
        
        lessons = CURRICULUM_STRUCTURE.get(board, {}).get(class_level, {}).get(subject, {}).get(chapter, [])
        print(f"Lessons found: {lessons}")
        
        return JsonResponse({
            "lessons": lessons,
            "board": board,
            "class_level": class_level,
            "subject": subject,
            "chapter": chapter
        })
    except Exception as e:
        print(f"Error getting lessons: {e}")
        return JsonResponse({"lessons": [], "error": str(e)})