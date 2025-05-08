document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInputArea = document.querySelector('.chat-input-area');
    const userInput = document.getElementById('userInput');

    if (chatInputArea) {
        chatInputArea.style.display = 'flex';
    }

    // --- Configuration ---
    const TYPING_CHAR_DELAY_MS = 17; // Delay between each character appearing in input field for user (halved for faster typing)
    const BOT_FIXED_RESPONSE_MS = 500; // Bot's "typing" or "thinking" time (0.5 seconds)
    // Delays related to reading time, min/max, initial are removed or set to minimal values
    const MINIMAL_SEQUENTIAL_DELAY_MS = 10; // Small delay to ensure proper async sequencing if needed, almost immediate.
    const DELAY_AFTER_SPACE_PRESS_MS = 250; // Delay after Space before user typing simulation starts
    // countWords and calculateTimeMs are no longer needed for conversation flow delays
    // --- End Configuration ---

    // --- Conversation Scenarios ---
    const conversationFlow1 = [
        { type: 'system', text: 'Scenario 1' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Welcome 👋 I\'m your virtual functional-medicine doctor.\nI\'ll review your symptoms and lab results to uncover the root causes affecting your thyroid and overall health.\n\nReady to begin?'
        },
        { type: 'message', sender: 'user', text: 'Yes' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Great. Please send, in one message:\n• Age\n• Weight (lb or kg)\n• Height (ft/in or cm)'
        },
        { type: 'message', sender: 'user', text: '47 years, 137 lb, 5 ft 5 in.' },
        {
            type: 'message',
            sender: 'bot',
            text: 'During the last month, which of these have you experienced? (Add any others)\n• Fatigue\n• Brain fog / poor concentration\n• Hair loss\n• Dry skin\n• Constipation\n• Diarrhea\n• Bloating or gas\n• Anxiety or irritability\n• Weight gain\n• Cold hands or feet without a clear reason\n• Edema (please specify where)\n\nI understand these symptoms can be persistent and frustrating. We\'ll use a systems-based plan to calm the immune attack and support long-term healing.'
        },
        { type: 'message', sender: 'user', text: 'Fatigue after noon, brain fog, hair loss, dry skin, constipation, bloating/gas, irritability' },
        {
            type: 'message',
            sender: 'bot',
            text: 'About constipation and bloating:\n• How often is your bowel movement?\n• How long does the bloating last?'
        },
        { type: 'message', sender: 'user', text: 'Bowel movements every other day. Bloating and gas have bothered me for the last six months, very uncomfortable.' },
        { type: 'message', sender: 'bot', text: 'When were you first diagnosed with Hashimoto\'s?' },
        { type: 'message', sender: 'user', text: '2021' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Are you taking any thyroid medication or other supplements? Please list the name, dose, and how long you\'ve been on each.'
        },
        { type: 'message', sender: 'user', text: 'No thyroid medications. Tyrosine 1000mg, Omega-3 1250 mg, GABA 200 mg, Magnesium 200 mg, L-tryptophan 750 mg: 7-8 months' },
        { type: 'message', sender: 'bot', text: 'Do you have any other chronic conditions?' },
        { type: 'message', sender: 'user', text: 'No' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Tell me a bit about your lifestyle:\n• Would you call it active or mostly sedentary?\n• Workouts per week?\n• Average sleep per night?'
        },
        { type: 'message', sender: 'user', text: 'Pretty active. Exercise 3-4 times/week. Sleep 7-8 hours.' },
        { type: 'message', sender: 'bot', text: 'On a 0-5 scale, how would you rate stress in the morning, afternoon, and evening?' },
        { type: 'message', sender: 'user', text: 'Sometimes 3 all day. Sometimes Morning 4, Afternoon 1, Evening 3' },
        { type: 'message', sender: 'bot', text: 'On a 0-5 scale, how would you rate energy in the morning, afternoon, and evening?' },
        { type: 'message', sender: 'user', text: 'Morning 3.5, afternoon 2, evening 1' }, 
        {
            type: 'message',
            sender: 'bot',
            text: 'Please upload your most recent labs (photo or PDF). Recommended markers: TSH, Free T4, Free T3, Anti-TPO, Anti-TG, ALT, AST, bilirubin, glucose, lipid panel, ferritin, iron, vitamin D, vitamin B12.'
        },
        {
            type: 'image',
            sender: 'user',
            imageUrl: 'lab-results.jpeg'
        },
        {
            type: 'file',
            sender: 'user',
            fileName: '2025-04-25.pdf',
            fileSize: '4.2 MB',
            fileExt: 'PDF'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Thank you for the provided details. Here\'s the initial analysis:\n• TSH and Free T4 are within optimal limits, so the thyroid gland itself is producing hormones adequately.\n• Free T3 is low-this points to impaired conversion of T4 into its active form, T3. Because roughly 60% of that conversion happens in the liver, we need to target liver function first; better hepatic detoxification and bile flow will raise T3 and relieve symptoms.\n• In addition to your elevated thyroid antibodies, the low Free T3 is the primary driver of fatigue, brain fog, hair loss, and constipation.\n• Liver markers ALT and AST are elevated, and your lipid profile shows high cholesterol and triglycerides. Together, these results suggest metabolic liver dysfunction.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: "Key priority: begin with a liver-focused protocol to restore healthy T4->T3 conversion, stabilize lipids, and reduce antibody-related inflammation. Once liver function improves, we'll layer in gut repair and immune-calming strategies.\n\nAny questions? If you're ready, I'll generate a personalized treatment plan for the first 4 weeks."
        },
        {
            type: 'message',
            sender: 'user',
            text: 'No questions'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Here is the treatment plan for the first 4 weeks.'
        },
        {
            type: 'file',
            sender: 'bot',
            fileName: 'treatment-plan-week-1-4.pdf',
            fileSize: '4.5 MB',
            fileExt: 'PDF'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Baseline labs to order right away: ferritin, iron + TIBC, vitamin D (25-OH), vitamin B12.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Medication: Ursodiol 250 mg - take two tablets in the morning and one tablet in the evening for 3 months.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Key supplements:\n• Liposomal glutathione 250 mg daily\n• Zinc 10 mg daily\n• Curcumin 2 g daily combined with black-pepper extract for absorption'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Weeks 1 & 2 - Liver focus\nGoal: enhance detoxification, lower inflammation, and improve bile flow to boost T4->T3 conversion.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Weeks 3 & 4 - Gut health focus\nGoal: calm intestinal inflammation, reduce SIBO-related overgrowth, and improve digestion and absorption of macro- and micronutrients.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Nutrition: Follow the Hashimoto\'s-adapted anti-inflammatory diet outlined in your PDF.\nRe-check at the end of Week 4: repeat ALT, AST, bilirubin, Free T3, Free T4, and a lipid panel.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Next step after 4 weeks: adjust the treatment plan based on new labs and symptoms, then add modules for systemic anti-inflammation, lymphatic support, stress regulation, immune balancing, and further antibody reduction.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Would you like me to e-prescribe Ursodiol to your pharmacy and issue lab orders for ferritin, iron + TIBC, vitamin D (25-OH), and vitamin B12?'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'Yes'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Do you have any questions about the plan?'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'When might I feel better?'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Most patients notice more energy and less bloating within about two weeks if they follow the plan closely.'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'Shouldn\'t gut work start sooner because of constipation and bloating?'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Constipation and bloating tell us the gut is out of balance. About 70% of immune cells live there, so gut repair is critical for dialing down auto-antibodies. We start liver support first because it improves hormone conversion and bile flow - both make the gut protocol more effective in weeks 3-4.'
        },
        { type: 'system', text: 'End of Scenario 1' },
    ];

    const conversationFlow2 = [
        { type: 'system', text: 'Scenario 2' },
        {
            type: 'image',
            sender: 'user',
            imageUrl: 'food.png'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Hey, that looks amazing! 🙌 That\'s a great balance of protein and carbs. Though… didn\'t we talk about including some fermented foods starting today? 😊'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'Oh right, I totally forgot!'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'No worries! Quick reminder - a healthy gut helps keep inflammation down, which is key for managing your autoimmune condition. How about adding some sauerkraut on the side? You mentioned yesterday that you have it at home.'
        },
        { type: 'system', text: 'End of Scenario 2' },
    ];

    const conversationFlow3 = [
        { type: 'system', text: 'Scenario 3' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Hi again - it\'s been four weeks! At the start, you had fatigue, hair loss, constipation, dry skin, bloating, and irritability. How are you feeling now?'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'way more energy, no afternoon naps. bowels regular, no bloating. skin smoother. less irritable.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'That\'s excellent progress 🎉 I\'ve also reviewed your follow-up labs:\n• ALT & AST have returned to normal, confirming the liver protocol is working.\n• Triglycerides are now in the normal range, and total cholesterol has improved-still a bit above target, but trending in the right direction.\n• Free T3 is climbing, which means T4-to-T3 conversion is improving.\n\nLowering thyroid antibodies will take longer, but your symptom relief and lab gains show we\'re on track. Next step: keep the gut program going and add targeted immune-modulation support. We\'ll reassess antibodies, cholesterol, and overall progress at the eight-week mark and adjust supplements if needed.'
        },
        { type: 'system', text: 'End of Scenario 3' },
    ];

    let activeConversation = conversationFlow1; // Default to conversationFlow1
    let currentItemIndex = 0;
    let currentTimeoutId = null;
    let spaceKeyListenerActive = false; 
    window.spaceKeyListenerGlobal = null; 
    // --- End Conversation Scenarios & State ---

    // --- Helper & Display Functions ---
    function displayItem(item) {
        if (!item) return;
        if (item.type === 'system') {
            displaySystemMessage(item.text);
        } else if (item.type === 'message') {
            displayChatMessage(item.text, item.sender);
        } else if (item.type === 'file') {
            displayFileMessage(item.fileName, item.fileSize, item.fileExt, item.sender);
        } else if (item.type === 'image') {
            displayImageMessage(item.imageUrl, item.sender);
        }
    }

    function displaySystemMessage(text) {
        const systemMessageWrapper = document.createElement('div');
        systemMessageWrapper.classList.add('system-message-wrapper');
        const systemMessageDiv = document.createElement('div');
        systemMessageDiv.classList.add('system-message');
        systemMessageDiv.textContent = text;
        systemMessageWrapper.appendChild(systemMessageDiv);
        chatMessages.appendChild(systemMessageWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayChatMessage(text, sender) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        let htmlText = text;
        // Apply Markdown parsing
        // Bold
        htmlText = htmlText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        htmlText = htmlText.replace(/__(.+?)__/g, '<strong>$1</strong>');
        // Italic
        htmlText = htmlText.replace(/\*(.+?)\*/g, '<em>$1</em>');
        htmlText = htmlText.replace(/_(.+?)_/g, '<em>$1</em>');
        // Newlines
        htmlText = htmlText.replace(/\n/g, '<br>');

        messageContent.innerHTML = htmlText;
        messageBubble.appendChild(messageContent);
        const messageMeta = document.createElement('div');
        messageMeta.classList.add('message-meta');
        const timestamp = document.createElement('span');
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageMeta.appendChild(timestamp);
        if (sender === 'user') {
            messageBubble.classList.add('user-message');
        } else {
            messageBubble.classList.add('bot-message');
        }
        messageBubble.appendChild(messageMeta);
        chatMessages.appendChild(messageBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayImageMessage(imageUrl, sender) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = (sender === 'user') ? "User Uploaded Image" : "Bot Sent Image";
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.borderRadius = '5px';
        img.onload = () => { chatMessages.scrollTop = chatMessages.scrollHeight; }; 
        messageBubble.appendChild(img);
        const messageMeta = document.createElement('div');
        messageMeta.classList.add('message-meta');
        const timestamp = document.createElement('span');
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageMeta.appendChild(timestamp);
        if (sender === 'user') {
            messageBubble.classList.add('user-message');
        } else {
            messageBubble.classList.add('bot-message');
        }
        messageBubble.appendChild(messageMeta);
        chatMessages.appendChild(messageBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    }

    function displayFileMessage(fileName, fileSize, fileExt, sender) {
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        const fileContainer = document.createElement('div');
        fileContainer.classList.add('file-container');
        const fileIcon = document.createElement('div');
        fileIcon.classList.add('file-icon');
        fileIcon.textContent = fileExt.toUpperCase();
        const fileDetails = document.createElement('div');
        fileDetails.classList.add('file-details');
        const fileNameDiv = document.createElement('div');
        fileNameDiv.classList.add('file-name');
        fileNameDiv.textContent = fileName;
        const fileMetaDiv = document.createElement('div');
        fileMetaDiv.classList.add('file-meta-info');
        fileMetaDiv.textContent = `${fileSize} • ${fileExt.toLowerCase()}`;
        fileDetails.appendChild(fileNameDiv);
        fileDetails.appendChild(fileMetaDiv);
        fileContainer.appendChild(fileIcon);
        fileContainer.appendChild(fileDetails);
        messageBubble.appendChild(fileContainer);
        const messageMeta = document.createElement('div');
        messageMeta.classList.add('message-meta');
        const timestamp = document.createElement('span');
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageMeta.appendChild(timestamp);
        if (sender === 'user') {
            messageBubble.classList.add('user-message');
        } else {
            messageBubble.classList.add('bot-message');
        }
        messageBubble.appendChild(messageMeta);
        chatMessages.appendChild(messageBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async function simulateUserTypingIntoInput(messageText) {
        if (userInput) {
            userInput.focus(); 
            userInput.value = ''; 
            for (let i = 0; i < messageText.length; i++) {
                userInput.value += messageText[i];
                userInput.scrollLeft = userInput.scrollWidth; 
                await new Promise(resolve => setTimeout(resolve, TYPING_CHAR_DELAY_MS));
            }
        }
    }
    
    async function processUserTurnAutomated(userMessageItem) {
        if (userInput) {
            await simulateUserTypingIntoInput(userMessageItem.text);
            displayChatMessage(userMessageItem.text, 'user');
            userInput.value = ''; 
            userInput.blur(); 
        }
        currentItemIndex++;
        showNextItem(); 
    }

    function showNextItem() {
        if (currentTimeoutId) { 
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        if (spaceKeyListenerActive && typeof window.spaceKeyListenerGlobal === 'function') { 
            window.removeEventListener('keydown', window.spaceKeyListenerGlobal);
            spaceKeyListenerActive = false;
            window.spaceKeyListenerGlobal = null;
        }

        if (currentItemIndex >= activeConversation.length) {
            return;
        }

        const currentItem = activeConversation[currentItemIndex];

        if (currentItem.type === 'system') {
            displayItem(currentItem);
            currentItemIndex++;
            // Use a minimal delay to ensure display completes before next step in the queue.
            currentTimeoutId = setTimeout(() => showNextItem(), MINIMAL_SEQUENTIAL_DELAY_MS); 
            return;
        }

        // For all other types (user messages/files/images, bot messages/files/images), we wait for Space.
        // Determine the "preparation" delay before arming the space listener.
        let preparationDelayMs = MINIMAL_SEQUENTIAL_DELAY_MS;
        if (currentItem.sender === 'bot') { // Any bot item (message, file, image)
             preparationDelayMs = BOT_FIXED_RESPONSE_MS;
        }
        // For user items (message, file, image), the preparation delay is MINIMAL_SEQUENTIAL_DELAY_MS.

        currentTimeoutId = setTimeout(() => {
            window.spaceKeyListenerGlobal = function(event) { 
                if (event.key === ' ' || event.code === 'Space') {
                    event.preventDefault();
                    if (typeof window.spaceKeyListenerGlobal === 'function') {
                       window.removeEventListener('keydown', window.spaceKeyListenerGlobal);
                    }
                    spaceKeyListenerActive = false;
                    window.spaceKeyListenerGlobal = null;
                    
                    // Action after space is pressed
                    if (currentItem.type === 'message' && currentItem.sender === 'user') {
                        // User's text message: simulate typing then display
                        setTimeout(() => {
                            processUserTurnAutomated(currentItem); 
                            // processUserTurnAutomated calls showNextItem()
                        }, DELAY_AFTER_SPACE_PRESS_MS); 
                    } else {
                        // Bot messages (any type), User files, User images: display immediately
                        displayItem(currentItem);
                        currentItemIndex++;
                        showNextItem(); // Then prepare the next item in the sequence
                    }
                }
            }
            window.addEventListener('keydown', window.spaceKeyListenerGlobal);
            spaceKeyListenerActive = true;
        }, preparationDelayMs);
    }

    function switchConversation(flow) {
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        if (spaceKeyListenerActive && typeof window.spaceKeyListenerGlobal === 'function') {
            window.removeEventListener('keydown', window.spaceKeyListenerGlobal);
            spaceKeyListenerActive = false;
            window.spaceKeyListenerGlobal = null;
        }
        chatMessages.innerHTML = ''; 
        activeConversation = flow;
        currentItemIndex = 0;
        showNextItem();
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === '1') {
            switchConversation(conversationFlow1); 
        } else if (event.key === '2') {
            switchConversation(conversationFlow2); 
        } else if (event.key === '3') {
            switchConversation(conversationFlow3); 
        }
    });

    showNextItem(); // Initial start with the default conversation (conversationFlow1)
}); 