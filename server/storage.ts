import { 
  User, InsertUser, 
  Project, InsertProject, 
  ProjectSkill, InsertProjectSkill,
  HackerSkill, InsertHackerSkill,
  HackerCertification, InsertHackerCertification,
  Review, InsertReview,
  Testimonial, InsertTestimonial,
  Application, InsertApplication,
  ContactMessage, InsertContactMessage
} from "@shared/schema";

// Define storage interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(userType?: string): Promise<User[]>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByClientId(clientId: number): Promise<Project[]>;
  listProjects(status?: string): Promise<Project[]>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  deleteProjects(ids: number[]): Promise<number>;
  
  // Project skills
  addProjectSkill(projectSkill: InsertProjectSkill): Promise<ProjectSkill>;
  getProjectSkills(projectId: number): Promise<ProjectSkill[]>;
  
  // Hacker skills
  addHackerSkill(hackerSkill: InsertHackerSkill): Promise<HackerSkill>;
  getHackerSkills(userId: number): Promise<HackerSkill[]>;
  
  // Hacker certifications
  addHackerCertification(certification: InsertHackerCertification): Promise<HackerCertification>;
  getHackerCertifications(userId: number): Promise<HackerCertification[]>;
  
  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByHackerId(hackerId: number): Promise<Review[]>;
  getReviewsByClientId(clientId: number): Promise<Review[]>;
  
  // Testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  listTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  
  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByHackerId(hackerId: number): Promise<Application[]>;
  getApplicationsByProjectId(projectId: number): Promise<Application[]>;
  updateApplication(id: number, application: Partial<Application>): Promise<Application | undefined>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  listContactMessages(): Promise<ContactMessage[]>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private projectSkills: Map<number, ProjectSkill>;
  private hackerSkills: Map<number, HackerSkill>;
  private hackerCertifications: Map<number, HackerCertification>;
  private reviews: Map<number, Review>;
  private testimonials: Map<number, Testimonial>;
  private applications: Map<number, Application>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userId: number;
  private projectId: number;
  private projectSkillId: number;
  private hackerSkillId: number;
  private hackerCertificationId: number;
  private reviewId: number;
  private testimonialId: number;
  private applicationId: number;
  private contactMessageId: number;
  
  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.projectSkills = new Map();
    this.hackerSkills = new Map();
    this.hackerCertifications = new Map();
    this.reviews = new Map();
    this.testimonials = new Map();
    this.applications = new Map();
    this.contactMessages = new Map();
    
    this.userId = 1;
    this.projectId = 1;
    this.projectSkillId = 1;
    this.hackerSkillId = 1;
    this.hackerCertificationId = 1;
    this.reviewId = 1;
    this.testimonialId = 1;
    this.applicationId = 1;
    this.contactMessageId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Create a default admin user
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      password: "admin123",
      email: "admin@hackerhire.com",
      fullName: "System Admin",
      userType: "admin",
      bio: "System Administrator",
      company: null,
      title: "Administrator",
      location: null,
      profileImage: null,
      isVerified: true,
      createdAt: new Date()
    };
    
    this.users.set(adminUser.id, adminUser);
    
    // Create another admin for the user's requested credentials
    const customAdmin: User = {
      id: this.userId++,
      username: "sihab",
      password: "sihab123",
      email: "sihab@hackerhire.com",
      fullName: "Sihab Admin",
      userType: "admin",
      bio: "Custom Admin",
      company: null,
      title: "Administrator",
      location: null,
      profileImage: null,
      isVerified: true,
      createdAt: new Date()
    };
    
    this.users.set(customAdmin.id, customAdmin);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    
    // Ensure all required fields are present to satisfy the User type
    const user: User = {
      id,
      createdAt: now,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      userType: insertUser.userType,
      fullName: insertUser.fullName,
      company: insertUser.company || null,
      title: insertUser.title || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      profileImage: insertUser.profileImage || null,
      isVerified: insertUser.isVerified !== undefined ? insertUser.isVerified : false
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async listUsers(userType?: string): Promise<User[]> {
    const allUsers = Array.from(this.users.values());
    if (userType) {
      return allUsers.filter(user => user.userType === userType);
    }
    return allUsers;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Project operations
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    
    // Ensure all required fields are present
    const project: Project = {
      id,
      title: insertProject.title,
      description: insertProject.description,
      requirements: insertProject.requirements,
      budget: insertProject.budget,
      timeframe: insertProject.timeframe,
      clientId: insertProject.clientId,
      status: insertProject.status || "open", // Default status
      additionalDetails: insertProject.additionalDetails || null,
      createdAt: now
    };
    
    this.projects.set(id, project);
    return project;
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getProjectsByClientId(clientId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.clientId === clientId
    );
  }
  
  async listProjects(status?: string): Promise<Project[]> {
    const allProjects = Array.from(this.projects.values());
    if (status) {
      return allProjects.filter(project => project.status === status);
    }
    return allProjects;
  }
  
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    const project = this.projects.get(id);
    if (!project) return false;
    
    // Delete the project
    this.projects.delete(id);
    
    // Also clean up related records if needed
    // For example, delete project skills, applications, reviews related to this project
    // This is a simplified version that only deletes the project itself
    
    return true;
  }
  
  async deleteProjects(ids: number[]): Promise<number> {
    let deletedCount = 0;
    
    for (const id of ids) {
      const deleted = await this.deleteProject(id);
      if (deleted) {
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
  
  // Project skills
  async addProjectSkill(insertProjectSkill: InsertProjectSkill): Promise<ProjectSkill> {
    const id = this.projectSkillId++;
    const projectSkill: ProjectSkill = { ...insertProjectSkill, id };
    this.projectSkills.set(id, projectSkill);
    return projectSkill;
  }
  
  async getProjectSkills(projectId: number): Promise<ProjectSkill[]> {
    return Array.from(this.projectSkills.values()).filter(
      (skill) => skill.projectId === projectId
    );
  }
  
  // Hacker skills
  async addHackerSkill(insertHackerSkill: InsertHackerSkill): Promise<HackerSkill> {
    const id = this.hackerSkillId++;
    
    // Ensure all required fields are present
    const hackerSkill: HackerSkill = {
      id,
      skill: insertHackerSkill.skill,
      userId: insertHackerSkill.userId,
      yearsExperience: insertHackerSkill.yearsExperience !== undefined ? insertHackerSkill.yearsExperience : null
    };
    
    this.hackerSkills.set(id, hackerSkill);
    return hackerSkill;
  }
  
  async getHackerSkills(userId: number): Promise<HackerSkill[]> {
    return Array.from(this.hackerSkills.values()).filter(
      (skill) => skill.userId === userId
    );
  }
  
  // Hacker certifications
  async addHackerCertification(insertCertification: InsertHackerCertification): Promise<HackerCertification> {
    const id = this.hackerCertificationId++;
    
    // Ensure all required fields are present
    const certification: HackerCertification = {
      id,
      name: insertCertification.name,
      userId: insertCertification.userId,
      issuer: insertCertification.issuer !== undefined ? insertCertification.issuer : null,
      dateObtained: insertCertification.dateObtained !== undefined ? insertCertification.dateObtained : null
    };
    
    this.hackerCertifications.set(id, certification);
    return certification;
  }
  
  async getHackerCertifications(userId: number): Promise<HackerCertification[]> {
    return Array.from(this.hackerCertifications.values()).filter(
      (cert) => cert.userId === userId
    );
  }
  
  // Reviews
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const now = new Date();
    
    // Ensure all required fields are present
    const review: Review = {
      id,
      clientId: insertReview.clientId,
      projectId: insertReview.projectId,
      hackerId: insertReview.hackerId,
      rating: insertReview.rating,
      comment: insertReview.comment !== undefined ? insertReview.comment : null,
      createdAt: now
    };
    
    this.reviews.set(id, review);
    return review;
  }
  
  async getReviewsByHackerId(hackerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.hackerId === hackerId
    );
  }
  
  async getReviewsByClientId(clientId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.clientId === clientId
    );
  }
  
  // Testimonials
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    // Explicitly create a testimonial object with all required properties
    const testimonial: Testimonial = { 
      id, 
      reviewId: insertTestimonial.reviewId,
      isFeatured: false 
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async listTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.isFeatured
    );
  }
  
  // Applications
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const now = new Date();
    // Explicitly create an application object with all required properties
    const application: Application = { 
      id, 
      projectId: insertApplication.projectId,
      hackerId: insertApplication.hackerId,
      proposal: insertApplication.proposal,
      estimatedTime: insertApplication.estimatedTime,
      priceQuote: insertApplication.priceQuote,
      status: "pending", // Default value
      createdAt: now
    };
    this.applications.set(id, application);
    return application;
  }
  
  async getApplicationsByHackerId(hackerId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.hackerId === hackerId
    );
  }
  
  async getApplicationsByProjectId(projectId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (app) => app.projectId === projectId
    );
  }
  
  async updateApplication(id: number, applicationData: Partial<Application>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...applicationData };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Contact messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageId++;
    const now = new Date();
    const message: ContactMessage = { ...insertMessage, id, createdAt: now, isRead: false };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async listContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
