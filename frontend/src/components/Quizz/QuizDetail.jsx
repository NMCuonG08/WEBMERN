import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import { FaStar, FaRegStar, FaUsers, FaQuestionCircle, FaClock, FaTrophy, FaComment, FaPlay } from 'react-icons/fa';
import { getQuizById } from '../../api/quizzApi';
import { getCommentsByQuiz, addComment } from '../../api/commentApi';
import { getTopPlayers } from '../../api/scoreApi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import NavBar from '../../layout/NavBar';
import CreateLoading from '../common/CreateLoading';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth(); 
  const currentUser = auth?.currentUser; 
    const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const quizData = await getQuizById(id);
        console.log("user: "+ auth.currentUser);
        setQuiz(quizData);
        
        // Fetch comments for this quiz
        const commentsData = await getCommentsByQuiz(id);
        setComments(commentsData);
        


        const topPlayersData = await getTopPlayers(id);
        setTopPlayers(topPlayersData);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
        toast.error("Could not load quiz details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [id]);

  const handleStartQuiz = () => {
    navigate(`/play/${id}`);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.info("Please log in to leave a comment");
      return;
    }
    
    if (!newComment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }
    
    try {
      setSubmittingComment(true);
      
      const commentData = {
        quizId: id,
        text: newComment,
        userId: currentUser.id,
      };
      
      const result = await addComment(commentData);
      
      // Add the new comment to the comments state
      setComments(prev => [
        {
          ...result,
          user: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar
          }
        },
        ...prev
      ]);
      
      // Clear the comment input
      setNewComment('');
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-warning" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
     <CreateLoading/>
    );
  }

  if (!quiz) {
    return (
      <Container className="text-center my-5">
        <h3>Quiz not found</h3>
        <p>The quiz you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
     <NavBar/>
      <Row>
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="position-relative">
              <Card.Img 
                variant="top" 
                src={quiz.image} 
                alt={quiz.title}
                style={{ height: '280px', objectFit: 'cover' }}
              />
              <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                   style={{ 
                     background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                     padding: '50px 20px 20px'
                   }}>
                <h2 className="text-white mb-1">{quiz.title}</h2>
                <div className="d-flex align-items-center">
                  <Badge 
                    bg="primary" 
                    className="me-2 rounded-pill px-3 py-2"
                    style={{ 
                      background: 'linear-gradient(45deg, #FF9800, #FF5722)',
                      fontSize: '0.8rem'
                    }}
                  >
                    {quiz.category}
                  </Badge>
                  <Badge 
                    bg="success" 
                    className="rounded-pill px-3 py-2"
                    style={{ 
                      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                      fontSize: '0.8rem'
                    }}
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between mb-4">
                <div className="d-flex align-items-center me-3 mb-2">
                  <div className="me-2">
                    {renderStars(quiz.rating || 0)}
                  </div>
                  <span className="text-muted">({quiz.rating?.toFixed(1) || 0})</span>
                </div>
                
                <div className="d-flex">
                  <div className="d-flex align-items-center me-3 mb-2">
                    <FaQuestionCircle className="text-primary me-1" />
                    <span>{quiz.questionCount || 0} câu hỏi</span>
                  </div>
                  
                  <div className="d-flex align-items-center me-3 mb-2">
                    <FaUsers className="text-success me-1" />
                    <span>{quiz.participantCount?.toLocaleString() || 0} người chơi</span>
                  </div>
                  
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-danger me-1" />
                    <span>~{quiz.estimatedTime || 5} phút</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4>Mô tả</h4>
                <p className="text-muted">
                  {quiz.description || "Không có mô tả cho quiz này."}
                </p>
              </div>
              
              <div className="d-grid">
                <Button 
                  size="lg" 
                  onClick={handleStartQuiz}
                  style={{ 
                    background: 'linear-gradient(45deg, #2196F3, #673AB7)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.4)',
                    padding: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  className="rounded-pill"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 6px 18px rgba(33, 150, 243, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.4)';
                  }}
                >
                  <FaPlay className="me-2" /> Bắt đầu ngay!
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Comments Section */}
          <Card className="border-0 shadow-sm rounded-4 mt-4">
            <Card.Body>
              <h4 className="mb-4">
                <FaComment className="me-2 text-primary" />
                Bình luận ({comments.length})
              </h4>
              
              {/* Comment Form */}
              <Form onSubmit={handleCommentSubmit} className="mb-4">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Thêm bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingComment || !currentUser}
                    className="mb-2"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between align-items-center">
                  {!currentUser && (
                    <p className="text-muted mb-0">Vui lòng đăng nhập để bình luận</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={submittingComment || !currentUser || !newComment.trim()}
                    className="rounded-pill px-4"
                  >
                    {submittingComment ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang gửi...
                      </>
                    ) : "Gửi bình luận"}
                  </Button>
                </div>
              </Form>
              
              {/* Comment List */}
              {comments.length > 0 ? (
                <ListGroup variant="flush">
                  {comments.map(comment => (
                    <ListGroup.Item key={comment._id} className="border-bottom py-3">
                      <div className="d-flex">
                        <img 
                          src={comment.user?.avatar || "https://via.placeholder.com/40"} 
                          alt={comment.user?.name || "User"} 
                          className="rounded-circle me-3"
                          width="40"
                          height="40"
                        />
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0 me-2">{comment.user?.name || "Anonymous"}</h6>
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-0">{comment.text}</p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Leaderboard - Right Column */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h4 className="mb-3 d-flex align-items-center">
                <FaTrophy className="text-warning me-2" />
                Bảng xếp hạng
              </h4>
              
              {topPlayers.length > 0 ? (
                <ListGroup variant="flush">
                  {topPlayers.map((player, index) => (
                    <ListGroup.Item key={index} className="border-bottom py-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3 position-relative">
                          <img 
                            src={player.user?.avatar || "https://via.placeholder.com/40"} 
                            alt={player.user?.name} 
                            className="rounded-circle"
                            width="50"
                            height="50"
                          />
                          <div 
                            className="position-absolute bottom-0 start-100 translate-middle badge rounded-pill"
                            style={{ 
                              background: index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              transform: 'translate(-50%, 0)',
                              border: '2px solid white',
                              color: index === 0 ? 'black' : 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{player.user?.name}</h6>
                          <small className="text-muted">{player.completedAt}</small>
                        </div>
                        <div className="text-end">
                          <h5 className="mb-0 text-primary">{player.score}</h5>
                          <small className="text-success">
                            {Math.round(player.accuracy * 100)}% chính xác
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4 text-muted">
                  <p>Chưa có người chơi nào hoàn thành quiz này</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizDetail;