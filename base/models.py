from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.db.models.signals import post_delete

class Program(models.TextChoices):
    AAS_FLEX = 'AAS_FLEX', 'AAS Flexible Option'
    ACCOUNTING = 'ACCOUNTING', 'Accounting'
    ACTUARIAL_SCIENCE = 'ACTUARIAL_SCI', 'Actuarial Science'
    ADMIN_LEADERSHIP = 'ADMIN_LEAD', 'Administrative Leadership'
    ADULT_GERO_NP = 'ADULT_GERO_NP', 'Adult-Gerontology Acute Care Nurse Practitioner'
    AFRICAN_STUDIES = 'AFRICAN_STUDIES', 'African and African Diaspora Studies'
    AFRICAN_DANCE = 'AFRICAN_DANCE', 'African and Diaspora Dance Forms'
    AMERICAN_INDIAN = 'AMER_INDIAN', 'American Indian Studies'
    ASL_INTERPRETING = 'ASL_INTERP', 'American Sign Language/English Interpreting'
    ANIMATION = 'ANIMATION', 'Animation'
    ANTHROPOLOGY = 'ANTHRO', 'Anthropology'
    APPLIED_AI_IST = 'APPLIED_AI_IST', 'Applied AI for Information Science and Technology'
    APPLIED_BEHAVIOR = 'APPLIED_BEHAVIOR', 'Applied Behavior Analysis'
    APPLIED_COMPUTING = 'APPLIED_COMP', 'Applied Computing'
    APPLIED_ECONOMETRICS = 'APPLIED_ECON', 'Applied Econometrics and Data Analysis'
    APPLIED_GERONTOLOGY = 'APPLIED_GERO', 'Applied Gerontology'
    APPLIED_MATH_CS = 'APPLIED_MATH_CS', 'Applied Mathematics & Computer Science'
    ARABIC = 'ARABIC', 'Arabic'
    ARCH_STUDIES = 'ARCH_STUDIES', 'Architectural Studies'
    ARCHITECTURE = 'ARCHITECTURE', 'Architecture'
    ARCHIVES_RECORDS = 'ARCHIVES_RECORDS', 'Archives and Records Administration, Advanced Study'
    ART = 'ART', 'Art'
    ART_EDUCATION = 'ART_ED', 'Art Education'
    ART_HISTORY = 'ART_HISTORY', 'Art History'
    AI_MACHINE_LEARNING = 'AI_ML', 'Artificial Intelligence and Machine Learning'
    ARTS_INTEGRATION = 'ARTS_INTEG', 'Arts Integration & Learning'
    ASIAN_STUDIES = 'ASIAN_STUDIES', 'Asian Studies'
    ASSISTIVE_TECH = 'ASSIST_TECH', 'Assistive Technology and Accessible Design'
    ATHLETIC_TRAINING = 'ATHL_TRAIN', 'Athletic Training'
    AUTISM_SPECTRUM = 'AUTISM', 'Autism Spectrum Disorders'
    BIOCHEMISTRY = 'BIOCHEM', 'Biochemistry'
    BIOLOGICAL_SCI = 'BIO_SCI', 'Biological Sciences'
    BIO_HEALTH_INFORMATICS = 'BIO_HEALTH_INF', 'Biomedical and Health Informatics'
    BIOMEDICAL_ENG = 'BIOMED_ENG', 'Biomedical Engineering'
    BIOMEDICAL_SCI = 'BIOMED_SCI', 'Biomedical Sciences'
    BIOSTATISTICS = 'BIOSTATS', 'Biostatistics'
    BLOOD_BANKING = 'BLOOD_BANK', 'Blood Banking / Immunohematology'
    BUSINESS_ANALYTICS = 'BUS_ANALYTICS', 'Business Analytics'
    BUSINESS_MEDIA_FILM = 'BUS_MEDIA_FILM', 'Business of Media and Film Studies'
    CELTIC_STUDIES = 'CELTIC', 'Celtic Studies'
    MENTAL_PERFORMANCE = 'MENTAL_PERF', 'Certified Mental Performance Consultant'
    CHEMISTRY = 'CHEM', 'Chemistry'
    CHILD_ADOLESCENCE = 'CHILD_ADOL', 'Childhood & Adolescence Studies'
    CHINESE = 'CHINESE', 'Chinese'
    CINEMATIC_ARTS = 'CINEMA', 'Cinematic Arts'
    CIVIL_ENGINEERING = 'CIV_ENG', 'Civil Engineering'
    CLASSICS = 'CLASSICS', 'Classics'
    CLINICAL_NURSE = 'CLINICAL_NURSE', 'Clinical Nurse Specialist'
    COMMITTEE_INTERDISC = 'COMM_INTERDISC', 'Committee Interdisciplinary Major'
    COMMUNICATION = 'COMM', 'Communication'
    COMM_SCI_DISORDERS = 'COMM_SCI_DIS', 'Communication Sciences & Disorders'
    COMMUNITY_ORG_CHANGE = 'COMM_ORG_CHANGE', 'Community and Organizational Change'
    COMMUNITY_ARTS = 'COMM_ARTS', 'Community Arts'
    COMMUNITY_ED = 'COMM_ED', 'Community Engagement & Education'
    COMMUNITY_STRAT = 'COMM_STRAT', 'Community Engagement Strategies'
    COMPARATIVE_ETHNIC = 'ETHNIC_STUDIES', 'Comparative Ethnic Studies'
    COMPARATIVE_LIT = 'COMP_LIT', 'Comparative Literature'
    COMPUTER_ENG = 'COMP_ENG', 'Computer Engineering'
    COMPUTER_SCIENCE = 'CS', 'Computer Science'
    COMPUTER_SCIENCE_BA = 'CS_BA', 'Computer Science (Bachelor of Arts)'
    CONFLICT_RESILIENCE = 'CONFLICT_RESIL', 'Conflict Transformation and Resilience'
    CONSERVATION_ENV = 'CONSERV_ENV', 'Conservation & Environmental Science'
    COUNSELING = 'COUNSELING', 'Counseling'
    CRIME_ANALYSIS = 'CRIME_ANALYSIS', 'Crime Analysis'
    CRIMINAL_JUSTICE = 'CRIM_JUSTICE', 'Criminal Justice and Criminology'
    CULTURAL_FOUNDATIONS = 'CULT_FOUND', 'Cultural Foundations of Community Engagement & Education'
    CULTURES_COMMUNITIES = 'CULTURES_COMM', 'Cultures and Communities'
    CURRICULUM_INST = 'CURRIC_INST', 'Curriculum & Instruction'
    CYBER_FORENSICS = 'CYBER_FORENSICS', 'Cyber Crime Forensics'
    CYBERSECURITY = 'CYBERSECURITY', 'Cybersecurity'
    DANCE = 'DANCE', 'Dance'
    DATA_ANALYTICS_AI = 'DATA_AN_AI', 'Data Analytics & Applied Artificial Intelligence'
    DATA_CURATION = 'DATA_CURATION', 'Data Curation'
    DATA_LIBRARIANSHIP = 'DATA_LIB', 'Data Librarianship: Information Organization'
    DATA_SCIENCE = 'DATA_SCIENCE', 'Data Science'
    DEATH_INVESTIGATION = 'DEATH_INVEST', 'Death Investigation'
    DESIGN_VISUAL_COMM = 'DESIGN_VIS_COMM', 'Design & Visual Communication'
    DIGITAL_ARTS_CULT = 'DIG_ARTS_CULT', 'Digital Arts and Culture'
    DIGITAL_FABRICATION = 'DIG_FAB', 'Digital Fabrication & Design'
    DIGITAL_LIBRARIES = 'DIG_LIB', 'Digital Libraries, Advanced Study'
    DIGITAL_SUPPLY_CHAIN = 'DIG_SUPPLY_CHAIN', 'Digital Supply Chain Management'
    NURSING_PRACTICE = 'DNP', 'Doctor of Nursing Practice'
    ECONOMIC_DATA_AN = 'ECON_DATA_AN', 'Economic Data Analysis'
    ECONOMICS = 'ECON', 'Economics'
    EDUCATION = 'EDUCATION', 'Education'
    EDUCATIONAL_PSYCH = 'ED_PSYCH', 'Educational Psychology'
    ELECTRICAL_ENG = 'ELEC_ENG', 'Electrical Engineering'
    ENGINEERING = 'ENGINEERING', 'Engineering'
    ENGLISH = 'ENGLISH', 'English'
    ENTERPRISE_PLANNING = 'ERP', 'Enterprise Resource Planning'
    ENTREPRENEURSHIP = 'ENTREP', 'Entrepreneurship'
    ENVIRONMENTAL_ENG = 'ENV_ENG', 'Environmental Engineering'
    ENVIRONMENTAL_HEALTH = 'ENV_HEALTH', 'Environmental Health Sciences'
    EPIDEMIOLOGY = 'EPIDEMIOLOGY', 'Epidemiology'
    ETHICS_SOCIETY = 'ETHICS_SOCIETY', 'Ethics, Values, and Society'
    EXCEPTIONAL_ED = 'EXCEPT_ED', 'Exceptional Education'
    EXECUTIVE_MBA = 'EMBA', 'Executive MBA'
    FAMILY_NP = 'FAMILY_NP', 'Family Nurse Practitioner'
    FILM = 'FILM', 'Film'
    FILM_STUDIES = 'FILM_STUDIES', 'Film Studies'
    FINANCE = 'FINANCE', 'Finance'
    FORENSIC_SCIENCE = 'FORENSIC_SCI', 'Forensic Science'
    FORENSIC_TOXICOLOGY = 'FORENSIC_TOX', 'Forensic Toxicology'
    FRENCH = 'FRENCH', 'French'
    FRESHWATER_SCI = 'FRESHWATER_SCI', 'Freshwater Sciences'
    FRESHWATER_TECH = 'FRESHWATER_TECH', 'Freshwater Sciences & Technology'
    GAME_ART_DESIGN = 'GAME_ART', 'Game Art and Design'
    GENERAL_BUSINESS = 'GEN_BUSINESS', 'General Business'
    GIS_SPATIAL_AN = 'GIS_SPATIAL', 'Geographic Information Science and Spatial Analysis (GIS SA)'
    GIS_CERT = 'GIS_CERT', 'Geographic Information Systems'
    GIS_UCP_1 = 'GIS_UCP_1', 'Geographic Information Systems for Urban & Community Professionals 1 (GIS UCP 1)'
    GIS_UCP_2 = 'GIS_UCP_2', 'Geographic Information Systems for Urban & Community Professionals 2 (GIS UCP 2)'
    GEOGRAPHY = 'GEOGRAPHY', 'Geography'
    GEOSCIENCES = 'GEOSCIENCES', 'Geosciences'
    GERMAN = 'GERMAN', 'German'
    GLOBAL_EDUCATOR = 'GLOBAL_ED', 'Global Educator'
    GLOBAL_HEALTH = 'GLOBAL_HEALTH', 'Global Health'
    GLOBAL_STUDIES = 'GLOBAL_STUDIES', 'Global Studies'
    HEALTH_CARE_ADMIN = 'HEALTH_ADMIN', 'Health Care Administration'
    HEALTH_INFORMATICS = 'HEALTH_INF', 'Health Care Informatics'
    HEALTH_PROF_ED = 'HEALTH_PROF_ED', 'Health Professional Education'
    HEALTH_SCI_DOC = 'HEALTH_SCI', 'Health Sciences'
    HEALTH_COMPLIANCE = 'HEALTH_COMPLIANCE', 'Healthcare Compliance'
    HEALTHY_AGING = 'HEALTHY_AGING', 'Healthy Aging'
    HISTORY = 'HISTORY', 'History'
    HMONG_STUDIES = 'HMONG', 'Hmong Diaspora Studies'
    HOLOCAUST_STUDIES = 'HOLOCAUST', 'Holocaust, Genocide and Human Rights'
    HUMAN_RESOURCES = 'HRM', 'Human Resources Management'
    ILLUSTRATION = 'ILLUSTRATION', 'Illustration'
    INDUSTRIAL_ENG = 'IND_ENG', 'Industrial Engineering'
    INFO_ARCH = 'INFO_ARCH', 'Information Architecture: Information Organization'
    IST = 'IST', 'Information Science & Technology'
    INFO_SECURITY = 'INFO_SEC', 'Information Security'
    INFO_STUDIES = 'INFO_STUDIES', 'Information Studies'
    IT_MANAGEMENT = 'IT_MGMT', 'Information Technology Management'
    LANGUAGE_LITERACY = 'LANG_LIT', 'Interdisciplinary Language and Literacy Intervention'
    INTL_BUSINESS = 'INTL_BUS', 'International Business'
    INTL_HR_LABOR = 'INTL_HR_LABOR', 'International Human Resources and Labor Relations'
    INTL_STUDIES = 'INTL_STUDIES', 'International Studies'
    INTERPROF_LEADERSHIP = 'INTERPROF_LEAD', 'Interprofessional Leadership in Healthcare'
    INVESTMENT_MGMT = 'INVEST_MGMT', 'Investment Management'
    ITALIAN = 'ITALIAN', 'Italian'
    JAPANESE = 'JAPANESE', 'Japanese'
    JEWISH_STUDIES = 'JEWISH_STUDIES', 'Jewish Studies'
    JAMS = 'JAMS', 'Journalism, Advertising, & Media Studies'
    KINESIOLOGY = 'KINESIOLOGY', 'Kinesiology'
    KOREAN_STUDIES = 'KOREAN', 'Korean Studies'
    LATIN_AMER_CARIB = 'LAT_AMER_CARIB', 'Latin American & Caribbean Studies'
    LATINX_STUDIES = 'LATINX_STUDIES', 'Latin American, Caribbean, & US Latinx Studies'
    LATINO_STUDIES = 'LATINO_STUDIES', 'Latino Studies'
    LGBT_STUDIES = 'LGBT_STUDIES', 'Lesbian, Gay, Bisexual & Transgender Studies'
    LIBRARY_INFO_SCI = 'MLIS', 'Library & Information Science'
    LINGUISTICS = 'LINGUISTICS', 'Linguistics'
    MANAGEMENT = 'MANAGEMENT', 'Management'
    MANAGEMENT_SCI = 'MGMT_SCI', 'Management Science'
    MARKETING = 'MARKETING', 'Marketing'
    MBA = 'MBA', 'Master of Business Administration'
    MHRLR = 'MHRLR', 'Master of Human Resources & Labor Relations'
    MPA = 'MPA', 'Master of Public Administration'
    SUSTAINABLE_PEACE = 'SUST_PEACE', 'Master of Sustainable Peacebuilding'
    MATERIALS_ENG = 'MATERIALS_ENG', 'Materials Engineering'
    MATERNAL_CHILD_HEALTH = 'MATERNAL_CHILD', 'Maternal & Child Health'
    MATHEMATICS = 'MATH', 'Mathematics'
    MATH_TEACHER_LEAD = 'MATH_LEAD', 'Mathematics Teacher Leadership'
    MECHANICAL_ENG = 'MECH_ENG', 'Mechanical Engineering'
    MEDIATION = 'MEDIATION', 'Mediation and Negotiation'
    METADATA = 'METADATA', 'Metadata: Information Organization'
    MICROBIOLOGY = 'MICROBIOLOGY', 'Microbiology'
    MENA_STUDIES = 'MENA', 'Middle Eastern & North African Studies'
    MOLECULAR_DIAGNOSTICS = 'MOLECULAR_DIAG', 'Molecular Diagnostics'
    MULTIDISCIPLINARY_PHD = 'MULTIDISC_PHD', 'Multidisciplinary Committee-Directed PhD'
    MUSEUM_STUDIES = 'MUSEUM', 'Museum Studies'
    MUSIC = 'MUSIC', 'Music'
    MUSIC_COMP_TECH = 'MUSIC_COMP_TECH', 'Music Composition & Technology'
    MUSIC_COMP_THEORY = 'MUSIC_COMP_THEORY', 'Music Composition & Theory'
    MUSIC_CONDUCTING = 'MUSIC_COND', 'Music Conducting'
    MUSIC_ED = 'MUSIC_ED', 'Music Education'
    MUSIC_HISTORY = 'MUSIC_HIST', 'Music History & Literature'
    MUSIC_INFO_SCI = 'MUSIC_INFO_SCI', 'Music Library / Information Science'
    MUSIC_PERFORMER = 'MUSIC_PERF_CERT', 'Music Performer’s Certificate'
    MUSIC_STRING = 'MUSIC_STRING', 'Music String Pedagogy'
    MUSICAL_THEATRE = 'MUSICAL_THEATRE', 'Musical Theatre'
    NEUROSCIENCE = 'NEURO', 'Neuroscience'
    NON_PROFIT_MGMT = 'NONPROFIT_MGMT', 'Non-Profit Management'
    NONPROFIT_ADVOCACY = 'NONPROFIT_ADV', 'Nonprofit Advocacy'
    NONPROFIT_FINANCE = 'NONPROFIT_FIN', 'Nonprofit Financial Management and Accountability'
    NONPROFIT_FUNDRAISING = 'NONPROFIT_FUND', 'Nonprofit Fundraising'
    NONPROFIT_GOV = 'NONPROFIT_GOV', 'Nonprofit Governance and Leadership'
    NURSING = 'NURSING', 'Nursing'
    NUTRITIONAL_SCI = 'NUTRITION', 'Nutritional Sciences'
    OCCUPATIONAL_TECH = 'OCC_TECH', 'Occupational Science & Technology'
    OCCUPATIONAL_THERAPY_M = 'OT_MASTER', 'Occupational Therapy (Master’s)'
    OCCUPATIONAL_THERAPY_D = 'OT_DOCTOR', 'Occupational Therapy (Doctoral)'
    ORG_LEAD_DEI = 'ORG_LEAD_DEI', 'Organizational Leadership in Diversity, Equity, and Inclusion'
    PEACE_CONFLICT = 'PEACE_CONFLICT', 'Peace and Conflict Studies'
    PHILOSOPHY = 'PHILOSOPHY', 'Philosophy'
    PHOTOGRAPHY = 'PHOTO', 'Photography'
    PHYSICAL_THERAPY = 'PT', 'Physical Therapy'
    PHYSICS = 'PHYSICS', 'Physics'
    POLITICAL_SCIENCE = 'POLI_SCI', 'Political Science'
    PORTUGUESE = 'PORTUGUESE', 'Portuguese'
    PRE_ANESTHESIA = 'PRE_ANESTHESIA', 'Pre-Anesthesiologist Assistant'
    PRE_ATHLETIC_TRAIN = 'PRE_ATHL_TRAIN', 'Pre-Athletic Training'
    PRE_AUDIOLOGY = 'PRE_AUDIOLOGY', 'Pre-Audiology'
    PRE_CHIRO = 'PRE_CHIRO', 'Pre-Chiropractic'
    PRE_DENTISTRY = 'PRE_DENTISTRY', 'Pre-Dentistry'
    PRE_DIETETICS = 'PRE_DIETETICS', 'Pre-Dietetics'
    PRE_LAW = 'PRE_LAW', 'Pre-Law'
    PRE_MEDICINE = 'PRE_MED', 'Pre-Medicine'
    PRE_OT = 'PRE_OT', 'Pre-Occupational Therapy'
    PRE_OPTOMETRY = 'PRE_OPTOMETRY', 'Pre-Optometry'
    PRE_PATH_ASSIST = 'PRE_PATH_ASSIST', 'Pre-Pathologists’ Assistant'
    PRE_PHARMACY = 'PRE_PHARMACY', 'Pre-Pharmacy'
    PRE_PT = 'PRE_PT', 'Pre-Physical Therapy'
    PRE_PA = 'PRE_PA', 'Pre-Physician Assistant'
    PRE_PODIATRY = 'PRE_PODIATRY', 'Pre-Podiatry'
    PRE_SPEECH_PATH = 'PRE_SPEECH_PATH', 'Pre-Speech Language Pathology'
    PRE_VET = 'PRE_VET', 'Pre-Veterinary Medicine'
    CIV_ENG_INFRA = 'CIV_ENG_INFRA', 'Professional Practice in Civil Engineering Infrastructure'
    PSYCH_MENTAL_NP = 'PSYCH_NP', 'Psychiatric Mental Health Nurse Practitioner'
    PSYCHOLOGY = 'PSYCHOLOGY', 'Psychology'
    PUBLIC_POP_HEALTH = 'PUB_POP_HEALTH', 'Public & Population Health'
    PUBLIC_HEALTH = 'PUB_HEALTH', 'Public Health'
    QUANT_SOCIAL_DATA = 'QUANT_SOCIAL_DATA', 'Quantitative Social Data Analysis'
    RACIAL_SOCIAL_JUSTICE = 'RACIAL_JUSTICE_ED', 'Racial and Social Justice in Education'
    REAL_ESTATE = 'REAL_ESTATE', 'Real Estate'
    RELIGIOUS_STUDIES = 'RELIGION', 'Religious Studies'
    RUSSIAN = 'RUSSIAN', 'Russian'
    RUSSIAN_EAST_EURO = 'RUSSIAN_EE', 'Russian & East European Studies'
    SCHOOL_COUNSELING = 'SCHOOL_COUNSEL', 'School Counseling'
    SCHOOL_LIBRARIAN = 'SCHOOL_LIB', 'School Librarianship'
    SCHOOL_PSYCH = 'SCHOOL_PSYCH', 'School Psychology'
    SENIOR_LIVING = 'SENIOR_LIVING', 'Senior Living and Services Leadership'
    SOCIAL_WELFARE = 'SOCIAL_WELFARE', 'Social Welfare'
    SOCIAL_WORK = 'SOCIAL_WORK', 'Social Work'
    SOCIOLOGY = 'SOCIOLOGY', 'Sociology'
    SOMATICS = 'SOMATICS', 'Somatics'
    SPANISH = 'SPANISH', 'Spanish'
    SPANISH_HEALTHCARE = 'SPAN_HEALTHCARE', 'Spanish for Healthcare Professionals'
    SPORT_PERF_PSYCH = 'SPORT_PSYCH', 'Sport and Performance Psychology'
    STRUCTURAL_ENG = 'STRUCTURAL_ENG', 'Structural Engineering'
    STUDENT_SUCCESS = 'STUDENT_SUCCESS', 'Student Success Advising and Technology-Based Services in Higher Education'
    STUDIO_ART = 'STUDIO_ART', 'Studio Art'
    COMP_INTEG_HEALTH = 'COMP_INTEG_HEALTH', 'Study of Complementary & Integrative Health Approaches'
    SUICIDE_PREVENTION = 'SUICIDE_PREV', 'Suicide Prevention Across the Lifespan'
    SUPPLY_CHAIN = 'SUPPLY_CHAIN', 'Supply Chain & Operations Management'
    TAXATION = 'TAXATION', 'Taxation'
    TEACH_LEARN_HIGHER = 'TEACH_LEARN_HIGHER', 'Teaching and Learning in Higher Education'
    TEACH_LEARN_ADV = 'TEACH_LEARN_ADV', 'Teaching and Learning, Advanced Study'
    THEATRE_ED = 'THEATRE_ED', 'Theatre Education'
    THEATRE_PERF = 'THEATRE_PERF', 'Theatre Performance'
    THEATRE_PRACTICES = 'THEATRE_PRACT', 'Theatre Practices'
    THEATRE_PROD = 'THEATRE_PROD', 'Theatre Production'
    THERAPEUTIC_REC = 'THERAPEUTIC_REC', 'Therapeutic Recreation'
    DISABILITY_TRANSITION = 'DIS_TRANSITION', 'Transition for Students with Disabilities'
    TRANSLATION_INTERP = 'TRANSL_INTERP', 'Translation & Interpreting Studies'
    TRAUMA_INFORMED = 'TRAUMA_INFORMED', 'Trauma-Informed Care'
    URBAN_DESIGN = 'URBAN_DESIGN', 'Urban Design'
    URBAN_EDUCATION = 'URBAN_ED', 'Urban Education'
    URBAN_PLANNING = 'URBAN_PLAN', 'Urban Planning'
    URBAN_STUDIES = 'URBAN_STUDIES', 'Urban Studies'
    VALUE_BASED_HEALTH = 'VALUE_HEALTHCARE', 'Value-Based Healthcare'
    WEB_DEVELOPMENT = 'WEB_DEV', 'Web Development'
    WOMENS_GENDER = 'WGS', 'Women’s and Gender Studies'
    WORLD_LANG_CULTURES = 'WORLD_LANG', 'World Language and Cultures'

class Term(models.TextChoices):
    fall = 'F', 'Fall'
    spring = 'S', 'Spring'

class DormBuilding(models.TextChoices):
    cambridge = 'C', 'Cambridge Commons'
    riverview = 'R', 'Riverview'
    sandburgnsw = 'S1', 'Sandburg (N/S/W)'
    sandburge = 'S2', 'Sandburg (E)'

class Gender(models.TextChoices):
    MALE = 'M', 'Male'
    FEMALE = 'F', 'Female'
    #UWM offers inclusive housing where some floors/suites are gender-neutral
    OTHER = 'O', 'Other'

class Standing(models.TextChoices):
    freshman = 'FR', 'Freshman'
    sophomore = 'SO', 'Sophomore'
    junior = 'JR', 'Junior'
    senior = 'SR', 'Senior'

class RoomType(models.TextChoices):
    single = 'S', 'Single'
    double = 'D', 'Double'
    triple = 'T', 'Triple'

class Group(models.Model):
    
    #ADD GROUP SPECIFIC FIELDS HERE
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name or f"Group {self.id}"

class GroupLike(models.Model):
    liker = models.ForeignKey(Group, related_name='likes_given', on_delete=models.CASCADE)
    liked = models.ForeignKey(Group, related_name='likes_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('liker', 'liked')

    def __str__(self):
        return f"{self.liker} likes {self.liked}"

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Have they filled out the form
    is_profile_complete = models.BooleanField(default=False)

    # Required fields (blank by default))
    programs = models.JSONField(default=list, blank=True)
    gender = models.CharField(max_length=2, choices=Gender.choices, null=True, blank=True)
    standing = models.CharField(max_length=2, choices=Standing.choices, null=True, blank=True)
    term = models.CharField(max_length=2, choices=Term.choices, null=True, blank=True)

    # Preferences (blank by default)
    dorm_building = models.CharField(max_length=2, choices=DormBuilding.choices, null=True, blank=True)
    room_type = models.CharField(max_length=2, choices=RoomType.choices, null=True, blank=True)
    preferences = models.JSONField(default=dict, blank=True)

    # Group
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, related_name='members', null=True, blank=True)

    def __str__(self):
        return self.user.username

#Automatically creates profiles for new users
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        new_group = Group.objects.create(name=f"{instance.username}'s Group")
        Profile.objects.create(user=instance, group=new_group)

#Automatically saves profiles when you save User changes
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

#Delete groups when a user is deleted and they were the only member
@receiver(post_delete, sender=Profile)
def delete_empty_group(sender, instance, **kwargs):
    group = instance.group
    if group:
        # Check if anyone else is still in this group
        if not group.members.exists():
            group.delete()