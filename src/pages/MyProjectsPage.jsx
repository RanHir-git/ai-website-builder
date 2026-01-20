import { Header } from "../cmps/Header";
import { Footer } from "../cmps/Footer";
import { useState, useEffect, useCallback } from "react";
import { getProjects, deleteProject } from "../services/projectService.Remote";
import { useAuth } from "../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/imgs/loadingJSON.json";
import { useNavigate, Link } from "react-router-dom";
import trashIcon from "../assets/imgs/trashIcon.svg";

export function MyProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getProjects();
            setProjects(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [user, isAuthenticated, fetchProjects]); // Re-fetch when user logs in/out

    return (
        <div className="my-projects-page">
            <Header />
            <main className="main-content">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Lottie
                            animationData={loadingAnimation}
                            loop={true}
                            style={{ width: 200, height: 200 }}
                        />
                    </div>
                ) : projects.length > 0 ? (
                    <div className="my-projects-container">
                        <h1 className="text-white text-4xl font-bold text-center mb-10">My Projects</h1>
                        
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <div key={project.id} className="my-project-card">
                                    <div className="project-preview">
                                        {project.current_code ? (
                                            <iframe
                                                srcDoc={project.current_code}
                                                sandbox="allow-scripts allow-same-origin"
                                                className="project-iframe"
                                            ></iframe>
                                        ) : (
                                            <div className="no-preview">No preview available</div>
                                        )}
                                    </div>
                                    <div className="project-card-content">
                                        <h2 className="project-title">{project.title}</h2>
                                        <p className="project-description">{project.initialPrompt}</p>
                                        <div className="project-footer">
                                            <span className="project-date">
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="project-actions">
                                                <Link 
                                                    className="action-btn preview-btn"
                                                    to={`/preview/${project.id}`}
                                                    target="_blank"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    Preview
                                                </Link>
                                                <button 
                                                    className="action-btn open-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/project/${project.id}`);
                                                    }}
                                                >
                                                    Open
                                                </button>
                                                <button 
                                                    className="action-btn delete-btn"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            await deleteProject(project.id);
                                                            // Refresh the projects list after deletion
                                                            fetchProjects();
                                                        } catch (error) {
                                                            console.error('Failed to delete project:', error);
                                                        }
                                                    }}
                                                >
                                                    <img src={trashIcon} alt="delete" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>No projects found</div>
                )}
            </main>
            <Footer />
        </div>
    );
}
