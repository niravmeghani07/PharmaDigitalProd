import React from 'react'
import { useState,useEffect } from 'react'
import GenericModal from "../GenericModal/GenericModal.jsx";
import axios from 'axios';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


function HandleNotification(isPendingModalOpen,isApprovalModalOpen) {
    const [managerPendingRequestCount, setmanagerPendingRequestCount] = useState(0);
    const [managerPendingRequest,setmanagerPendingRequest] = useState([]);
    const [userPendingRequests,setuserPendingRequests] = useState([]);
    const [userPendingRequestCount,setuserPendingRequestCount] = useState(0);
    const [handleModel,setHandleModel] = useState(isPendingModalOpen);
    const [approvalModel,setApprovalModel] = useState(isApprovalModalOpen);
    const [isApprovalRequestApproved, setIsApprovalRequestApproved] =
    useState(false);
    const[comments,setComments] = useState("");
  const [isApprovalRequestDeclined, setIsApprovalRequestDeclined] =
    useState(false);
    const username = sessionStorage.userName;
    const userDesignation = sessionStorage.designation;

    React.useEffect(() => {
      const fetchPendingRequest = async () => {
        try {
          console.log(username);
          const response = await axios.get("http://localhost:5000/api/pendingRequests");
          const requests = response.data;
          const pendingRequestCount = requests.length;
          const userRequest = requests.filter(request => request.from === username);
          const managerRequest = requests.filter(request => request.to === username);
          const userRequestCount = userRequest.filter(request => request.status === 'Pending').length;
          const managerRequestCount = managerRequest.filter(request => request.status === 'Pending').length;
    
          setmanagerPendingRequestCount(managerRequestCount);
          setmanagerPendingRequest(managerRequest);
          setuserPendingRequests(userRequest);
          setuserPendingRequestCount(userRequestCount);

          // Check if notification was clicked and set the appropriate modal state
          //console.log(notificationClicked);
          // if (notificationClicked) {
          //   if (isPendingModalOpen) {
          //     setHandleModel(true); // Set handleModel to true when isPendingModalOpen is true
          //   } else if (isApprovalModalOpen) {
          //     setApprovalModel(true); // Set handleModel to true when isApprovalModalOpen is true
          //   }
          //   setNotificationClicked(false); // Reset notificationClicked after handling
          // }
        } catch (error) {
          console.log("Error fetching the pending requests : ", error);
        }
      };
    
      fetchPendingRequest();
    }, [username, isPendingModalOpen, isApprovalModalOpen]);
  

    const handleRequestDataClick = (e) =>{
        e.preventDefault();
        //setisNavigated(true);
        // Navigate to a new page
        window.open('/', '_blank');
      }

      const handleApproveRequest = async (request) => {
        console.log("data.==>"+request.data);
        const userData = {
          data: request.data,
          comment: comments,
          statusModifiedData: new Date
        };
        console.log(userData);
        try{
          const res = await axios.post('http://localhost:5000/api/approvestatusupdate', userData);
          console.log('User registered successfully:', res.data);
        }
        
        catch (error) {
          console.error('Error approve status:', error.message);
          // Handle errors or show an error message to the user
        }
        setTimeout(() => {  window.location.reload();     }, 5000);
        //window.location.reload();
        setIsApprovalRequestApproved(true);
        setIsApprovalRequestDeclined(false);
      };
    
      const handleDeclineRequest = async (request) => {
       console.log("data.==>"+request.data);
        const userData = {
          data: request.data,
          comment: comments,
          statusModifiedData: new Date
        };
        console.log(userData);
        try{
          const res = await axios.post('http://localhost:5000/api/declinestatusupdate', userData);
          console.log('User registered successfully:', res.data);
        }
        
        catch (error) {
          console.error('Error approve status:', error.message);
          // Handle errors or show an error message to the user
        }
        setTimeout(() => {  window.location.reload();     }, 5000);
       // window.location.reload();
        setIsApprovalRequestDeclined(true);
        setIsApprovalRequestApproved(false);
      };

      const handleGenericCloseModal = (modalName) =>{
        switch(modalName){
            case "PendingRequest-modal":
                setHandleModel(false);
                break;
            
            case "approval-modal":
                setApprovalModel(false);
                setIsApprovalRequestApproved(false);
                setIsApprovalRequestDeclined(false);
                break;
        }

      }

  return (
    <div>
        {isPendingModalOpen && userDesignation === 'Analyst' && (
  <GenericModal
    open={handleModel}
    handleClose={() => handleGenericCloseModal("PendingRequest-modal")}
    body={
      <div>
        {userPendingRequests.length > 0 ? (
          <table className="approval-table">
            <thead>
              <tr>
                <th>To</th>
                <th>Request</th>
                <th>Drug</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {userPendingRequests.map((request) => (
                <tr key={request._id}>
                  <td className="sender">{request.to}</td>
                  <td className="request-data">{request.data}</td>
                  <td className="drug">
                            <a href={"#"} onClick={(e) => handleRequestDataClick(e)}>
                                {request.drug}
                               </a>
                            </td>
                  <td className="status">
                    <div className="modal-button">
                      {request.status === 'Approved' && (
                        <p style={{ color: 'green' }}>
                          Approved
                        </p>
                      )}
                      {request.status === 'Pending' && (
                        <p style={{ color: 'orange' }}>
                          Pending
                        </p>
                      )}
                      {request.status === 'Declined' && (
                        <p style={{ color: 'red' }}>
                          Declined
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="request-comments">{request.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Handle the case where requiredUserData is empty
          <p>No data available</p>
        )}
      </div>
    }
  ></GenericModal>
)}

{isApprovalModalOpen && userDesignation !== 'Analyst' && (
        <GenericModal
          open={approvalModel}
          handleClose={() => handleGenericCloseModal("approval-modal")}
          body={
            <div>
              {isApprovalRequestApproved && (
                <div className="modal-response-msg success">
                  Request Approved !
                </div>
              )}
              {isApprovalRequestDeclined && (
                <div className="modal-response-msg reject">
                  Request Declined !
                </div>
              )}
              {!isApprovalRequestApproved && !isApprovalRequestDeclined ? (
                <div className="modal-body">
                  <div className="modal-title">Approve Request</div>
                  {/* <div className="modal-input">
                    <TextField
                      id="outlined-multiline-static"
                      label="Description"
                      multiline
                      rows={4}
                      sx={{ width: "100% !important" }}
                    />
                  </div> */}
                  {managerPendingRequest.length>0 ? (
                  
                    <table className="approval-table">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Request</th>
                          <th>Drug</th>
                          <th>Action</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {managerPendingRequest.map((request)=>(
                          <tr key={request._id}>
                           <td className="sender">{request.from}</td>
                            <td className="request-data">
                              {request.data}
                            </td>
                            <td className="drug">
                            <a href={"#"} onClick={(e) => handleRequestDataClick(e)}>
                                {request.drug}
                               </a>
                            </td>
                            <td className="action-buttons">
                            {request.status === 'Pending' ?(
                              <div className="modal-button">
                                  <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={()=>handleApproveRequest(request)}
                                >
                                  APPROVE
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={()=>handleDeclineRequest(request)}
                                >
                                  DECLINE
                                </Button>
                              </div>
                            ):(
                              <p style={{ color: request.status === 'Approved' ? 'green' : 'red' }}>
                                {request.status}
                              </p>
                            )} 
                            </td>
                            <td className="comment-textBox">
                            {request.status === 'Pending' ?(
                              <div className="modal-button">
                                 <TextField
                                      id="comments-multiline-static"
                                      value={comments}
                                      onChange={(e)=>setComments(e.target.value)}
                                      multiline
                                      rows={4}
                                      sx={{ width: "100% !important" }}
                                />
                               
                              </div>
                            ):(
                              <p>
                                {request.comment}
                              </p>
                            )} 
                            </td>
                          </tr>
                    ))}
                      </tbody>
                    </table>
                
                  ):(
                  <div>No pending requests</div>
                  )}
                  
                </div>
              ) : (
                <></>
              )}
            </div>
          }
        />
      )}
      
    </div>
  )
}

export default HandleNotification
