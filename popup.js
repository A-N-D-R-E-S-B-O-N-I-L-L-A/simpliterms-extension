document.addEventListener("DOMContentLoaded", async() => {


      let summaryInfo = {
        privacy: [],
        terms: [],
        token: '',
        host: ''
      };
      let canGiveAlikeODislike = false;
      let showRequestHeader = true;

      // not logged pages
      const notloggedPage = document.getElementById('not-logged');

      // logged part

      const loadingContainer = document.getElementById('loading-container');

      const errorView = document.getElementById('if-error');
      const successView = document.getElementById('not-error');

      const ErrorMessagDiv = document.getElementById("error-message");

      const subTypeElement = document.getElementById("sub-type");
      const usernameElement = document.getElementById("username-element");

      const greetingElement = document.getElementById("greeting");
      const simplitermsNameElement = document.getElementById("simpliterms-name");

      const loggedPage = document.getElementById('logged');

      const TermsSummaryHtmlText = document.getElementById('simpli-summary-terms');
      const PrivacySummaryHtmlText = document.getElementById('simpli-summary-privacy');

      const defaultText = document.getElementById('default-text');
      const detectedText = document.getElementById('detected-text');
      const defaultHostname = document.getElementById('default-hostname');
      const hostname = document.getElementById('hostname');
      const policyList = document.getElementById('policy-list');
      const termButton = document.getElementById('terms-buttom');
      const privacyButton = document.getElementById('privacy-button');

      termButton.addEventListener('click', ()=>{
          termButton.className = 'selected';
          privacyButton.className = '';
          TermsSummaryHtmlText.style.display = "block";
          PrivacySummaryHtmlText.style.display = "none";
          setTermsSummary(summaryInfo.terms);
      });

      privacyButton.addEventListener('click', ()=>{
          privacyButton.className = 'selected';
          termButton.className = '';
          TermsSummaryHtmlText.style.display = "none";
          PrivacySummaryHtmlText.style.display = "block";
          setPrivacySummary(summaryInfo.privacy);
      });

      // like and dislike functionalities
      const sendFeedBackUrl = "http://localhost:4200/api/summary";
      const questionHeader = document.getElementById('question-header');

      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', async(e)=>{

          e.preventDefault();
          questionHeader.style.display = "none";
          showRequestHeader = false;
          if (canGiveAlikeODislike) {
              try {
                
                const res =  await fetch(sendFeedBackUrl, {
                                          method: 'POST',
                                          headers: {
                                              'Content-Type': 'application/json',
                                              'x-token': summaryInfo.token
                                          },
                                          body: JSON.stringify({...summaryInfo,
                                            policyWebpage: summaryInfo.host,
                                            type: 'like'
                                          })
                                        }
                                    )

                await res.json();                
             
              } catch (error) {
                console.log(error);
                questionHeader.style.display = "flex";
                showRequestHeader = true;
              }
          }
      });

      const dislikeButton = document.getElementById('dislike-button');
      dislikeButton.addEventListener('click', async(e)=>{

          e.preventDefault();
          questionHeader.style.display = "none";
          showRequestHeader = false;
          if (canGiveAlikeODislike) {
              try {
                
                const res =  await fetch(sendFeedBackUrl, {
                                          method: 'POST',
                                          headers: {
                                              'Content-Type': 'application/json',
                                              'x-token': summaryInfo.token
                                          },
                                          body: JSON.stringify({...summaryInfo,
                                            policyWebpage: summaryInfo.host,
                                            type: 'dislike'
                                          })
                                        }
                                    )

                const result = await res.json();                
             
              } catch (error) {
                console.log(error);
                questionHeader.style.display = "flex";
                showRequestHeader = true;
              }
          }
      });
      
      //functions to set data
      const showSummaries = (list, type) => {
        for (let i = 0; i < list.length; i++) {
          const li = document.createElement('li');
          const h3 = document.createElement('h3');
          h3.textContent = list[i].subtitle;
          const p = document.createElement('p');
          p.textContent = list[i].text;
          li.appendChild(h3);
          li.appendChild(p);
          if (type === "privacy") {
            PrivacySummaryHtmlText.appendChild(li);
          }
          if (type === "terms") {
            TermsSummaryHtmlText.appendChild(li);
          }   
        }
      }

      const verifyIfAuthenticated = (auth) => {
        if (auth === false) {

          notloggedPage.style.display = "block";
          simplitermsNameElement.style.display = "block";
          loggedPage.style.display = "none";
          greetingElement.style.display = "none";

        }else{
          
          loggedPage.style.display = "block";
          greetingElement.style.display = "block";
          notloggedPage.style.display = "none";
          simplitermsNameElement.style.display = "none";

        }
      }

      const setPrivacySummary = (policies) => {
        if (policies.length === 0) {
            PrivacySummaryHtmlText.textContent = `loading...`;
            canGiveAlikeODislike = false;
            questionHeader.style.display = "none";
        }else{
          canGiveAlikeODislike = true;
          if (showRequestHeader) {
            questionHeader.style.display = "flex";
          }
          PrivacySummaryHtmlText.innerHTML = '';
          showSummaries(policies, "privacy");
        }
      }

      const setTermsSummary = (policies) => {
        if (policies.length === 0) {
            TermsSummaryHtmlText.textContent = `loading...`;
            canGiveAlikeODislike = false;
            questionHeader.style.display = "none";
        }else{
          canGiveAlikeODislike = true;
          if (showRequestHeader) {
            questionHeader.style.display = "flex";
          }
          TermsSummaryHtmlText.innerHTML = '';
          showSummaries(policies, "terms");
        }
      }

      const ifErrorShowIt = (errorMessage) => {
        if (errorMessage === "") {
          // there weren't none one error (different of the auth error) from the backend
          successView.style.display = "block";
          errorView.style.display = "none";
        }else{
          ErrorMessagDiv.textContent = `${errorMessage}`
          successView.style.display = "none";
          errorView.style.display = "block";
        }
      }

      const setUserInfo = (userInfo) => {

        if (userInfo.username !== null && 
            userInfo.planType !== null && 
            userInfo.username !== undefined && 
            userInfo.planType !== undefined)  
        {
          subTypeElement.textContent = `${userInfo.planType.toUpperCase()}`;
          usernameElement.textContent = `${userInfo.username}`;
          if (userInfo.planType === "free") {

              subTypeElement.style.backgroundColor = '#5712DF';

          }else if(userInfo.planType === "basic"){

              subTypeElement.style.backgroundColor = '#32EEB8';

          }else if(userInfo.planType === "pro"){

              subTypeElement.style.backgroundColor = 'black';

          }else{

              subTypeElement.textContent = "NONE"
              subTypeElement.style.backgroundColor = 'gray';

          }
        }

      }

      // send a message to the content.js when the popup is opened.
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: 'popupLoaded'});
      });


      // listen the response of the content.js 
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

          if (request.message === 'staticResult' && request.serverData) {

              loadingContainer.style.display = "none";
              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate);

              // if there was an error obtaining the static summary
              if(request.serverData.errorMessage !== ""){
                // send a message to the content.js if there is an error different of the auth error.
                loadingContainer.style.display = "flex";
                chrome.tabs.sendMessage(tabs[0].id, {message: 'termsAISumary'});
                chrome.tabs.sendMessage(tabs[0].id, {message: 'privacyAISumary'});
                return;
              }

              // validate there are policies to show
              setTermsSummary(request.serverData.termsOfUse);
              setPrivacySummary(request.serverData.termsOfPrivacy);

              // set the username info
              setUserInfo(request.serverData.userInfo);

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }
              
              if (request.serverData.ifPrivacy) {
                  policyList.textContent =  `${(request.serverData.ifPrivacy) ? 'Privacy Policy' : ''}, ${(request.serverData.ifTerms) ? 'Terms of Use' : ''}`
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                  
              summaryInfo = {
                privacy: request.serverData.termsOfPrivacy,
                terms: request.serverData.termsOfUse,
                token: request.serverData.tokenValidator,
                host: request.serverData.host
              }
              
          }

          if (request.message === 'termsAIResult' && request.serverData) {

              loadingContainer.style.display = "none";
              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate);

              // if there was an error obtaining the summary generated by AI
              if (request.serverData.errorMessage !== "") {
                TermsSummaryHtmlText.innerHTML = `😞 ${request.serverData.errorMessage}`;
                return;
              }

              // validate there are policies to show
              setTermsSummary(request.serverData.termsOfUse);
              setPrivacySummary(request.serverData.termsOfPrivacy);

              // set the username info
              setUserInfo(request.serverData.userInfo);

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }
              
              if (request.serverData.ifPrivacy) {
                  policyList.textContent =  `${(request.serverData.ifPrivacy) ? 'Privacy Policy' : ''}, ${(request.serverData.ifTerms) ? 'Terms of Use' : ''}`
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                  
              summaryInfo = {
                ...summaryInfo,
                terms: request.serverData.termsOfUse,
                token: request.serverData.tokenValidator,
                host: request.serverData.host
              }
              
          }

          if (request.message === 'privacyAIResult' && request.serverData) {

              loadingContainer.style.display = "none";
              // verify the authentication of user
              verifyIfAuthenticated(request.serverData.isAuthenticate);

              // if there was an error obtaining the summary generated by AI
              if (request.serverData.errorMessage !== "") {
                PrivacySummaryHtmlText.innerHTML = `😞 ${request.serverData.errorMessage}`;
                return;
              }

              // validate there are policies to show
              setTermsSummary(request.serverData.termsOfUse);
              setPrivacySummary(request.serverData.termsOfPrivacy);

              // set the username info
              setUserInfo(request.serverData.userInfo);

              // set the host
              if (request.serverData.host) {
                hostname.textContent = request.serverData.host;
                defaultHostname.textContent  = request.serverData.host;
              }
              
              if (request.serverData.ifPrivacy) {
                  policyList.textContent =  `${(request.serverData.ifPrivacy) ? 'Privacy Policy' : ''}, ${(request.serverData.ifTerms) ? 'Terms of Use' : ''}`
                  defaultText.style.display = 'none';
                  detectedText.style.display = 'block';
              }else{
                  detectedText.style.display = 'none';
                  defaultText.style.display = 'block';
              }
                  
              summaryInfo = {
                ...summaryInfo,
                privacy: request.serverData.termsOfPrivacy,
                token: request.serverData.tokenValidator,
                host: request.serverData.host
              }
              
          }

      });

});