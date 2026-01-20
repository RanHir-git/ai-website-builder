import { Header } from "../cmps/Header";
import { Footer } from "../cmps/Footer";
import { useState, useEffect } from "react";
import { getCommunityProjects } from "../services/projectService.Remote";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/imgs/loadingJSON.json";
import { useNavigate, Link } from "react-router-dom";
import trashIcon from "../assets/imgs/trashIcon.svg";

export function CommunityPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchCommunityProjects = async () => {
        try {
            const response = await getCommunityProjects();
            setProjects(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCommunityProjects();
    }, []);

    return (
        <div className="community-page">
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
                    <div className="community-projects-container">
                        <h1 className="text-white text-4xl font-bold text-center mb-10">Community Projects</h1>
                        
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    className="community-project-card"
                                    to={`/view/${project.id}`}
                                    target="_blank"
                                >
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
                                            <button 
                                                className="user-info" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/view/${project.id}`);
                                                }}
                                            >
                                                <span className="user-initials">{project.user?.name?.slice(0,1) || 'U'}</span>
                                                <span className="user-name">{project.user?.name || 'Unknown'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>No community projects found</div>
                )}
            </main>
            <Footer />
        </div>
    );
}
