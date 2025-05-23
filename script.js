document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const userInput = document.getElementById('userInput');

    // --- Configuration ---
    const TYPING_CHAR_DELAY_MS = 34; // This will now be a base, variation will be added
    const BOT_FIXED_RESPONSE_MS = 500; // Bot's "typing" or "thinking" time (0.5 seconds)
    const MINIMAL_SEQUENTIAL_DELAY_MS = 10; // Small delay to ensure proper async sequencing if needed, almost immediate.
    const DELAY_AFTER_SPACE_PRESS_MS = 250; // Delay after Space before user typing simulation starts
    // --- End Configuration ---

    // --- Conversation Scenarios ---
    const conversationFlow1 = [
        {
            type: 'message',
            sender: 'bot',
            text: 'Welcome 👋 I\'m your virtual functional-medicine doctor.\nI\'ll review your symptoms and lab results to uncover the root causes affecting your thyroid and overall health.\n\nReady to begin?'
        },
        { type: 'message', sender: 'user', text: 'yes' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Great. Please send, in one message:\n\n• Age\n• Weight (lb or kg)\n• Height (ft/in or cm)'
        },
        { type: 'message', sender: 'user', text: '47, 137lb, 5ft 5in' },
        {
            type: 'message',
            sender: 'bot',
            text: 'During the **last month**, which of these have you experienced? (Add any others)\n\n• Fatigue\n• Brain fog / poor concentration\n• Hair loss\n• Dry skin\n• Constipation\n• Diarrhea\n• Bloating or gas\n• Anxiety or irritability\n• Weight gain\n• Cold hands or feet with no reason\n• Edema (please specify where)\n\nI understand these symptoms can be persistent and frustrating. We\'ll use a systems-based plan to calm the immune attack and support long-term healing.'
        },
        { type: 'message', sender: 'user', text: 'fatigue after noon, brain fog, hair loss, dry skin, constipation, bloating gas, and im irritable' },
        {
            type: 'message',
            sender: 'bot',
            text: 'About constipation and bloating:\n\n• How often is your bowel movement?\n• How long does the bloating last?'
        },
        { type: 'message', sender: 'user', text: 'bm every other day. bloating and gas have bothered me for last 6 months, very uncomfortable.' },
        { type: 'message', sender: 'bot', text: 'When were you first diagnosed with Hashimoto\'s?' },
        { type: 'message', sender: 'user', text: '2021' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Are you taking any thyroid medication or other supplements? Please list the name, dose, and how long you\'ve been on each.'
        },
        { type: 'message', sender: 'user', text: 'no thyroid meds. tyrosine 1000mg, omega-3 1250mg, gaba 200mg, magnesium 200mg, l-tryptophan 750mg, been on them 7-8 months' },
        { type: 'message', sender: 'bot', text: 'Do you have any other chronic conditions?' },
        { type: 'message', sender: 'user', text: 'nope' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Tell me a bit about your lifestyle:\n\n• Would you call it active or mostly sedentary?\n• Workouts per week?\n• Average sleep per night?'
        },
        { type: 'message', sender: 'user', text: 'pretty active. exercise 3-4 times a week. sleep about 7-8 hours.' },
        { type: 'message', sender: 'bot', text: 'On a 0–5 scale, how would you rate **stress** in the morning, afternoon, and evening?' },
        { type: 'message', sender: 'user', text: 'sometimes 3 all day. or like morning 4, afternoon 1, evening 3' },
        { type: 'message', sender: 'bot', text: 'On a 0–5 scale, how would you rate **energy** in the morning, afternoon, and evening?' },
        { type: 'message', sender: 'user', text: 'morning 3.5, afternoon 2, evening 1.' }, 
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
            text: 'Thank you for the provided details. Here\'s the initial analysis:\n\n• **TSH** and **Free T4** are within optimal limits, so the thyroid gland itself is producing hormones adequately.\n• **Free T3** is **low**—this points to impaired conversion of T4 into its active form, T3. Because roughly 60% of that conversion happens in the liver, we need to target liver function first; better hepatic detoxification and bile flow will raise T3 and relieve symptoms.\n• In addition to your elevated thyroid antibodies, the low Free T3 is the primary driver of fatigue, brain fog, hair loss, and constipation.\n• Liver markers **ALT** and **AST** are elevated, and your lipid profile shows high cholesterol and triglycerides. Together, these results suggest **metabolic liver dysfunction**.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: "**Key priority**: begin with a liver-focused protocol to restore healthy T4→T3 conversion, stabilize lipids, and reduce antibody-related inflammation. Once liver function improves, we'll layer in gut repair and immune-calming strategies.\n\nAny questions? If you're ready, I'll generate a personalized treatment plan for the first 4 weeks."
        },
        {
            type: 'message',
            sender: 'user',
            text: 'no questions'
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
            text: '**Baseline labs to order right away**: ferritin, iron + TIBC, vitamin D (25-OH), vitamin B12.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Medication**: Ursodiol 250 mg—take two tablets in the morning and one tablet in the evening for 3 months.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Key supplements:**\n\n• Liposomal glutathione 250 mg daily\n• Zinc 10 mg daily\n• Curcumin 2 g daily combined with black-pepper extract for absorption'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Weeks 1 & 2—Liver focus**\nGoal: enhance detoxification, lower inflammation, and improve bile flow to boost T4→T3 conversion.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Weeks 3 & 4—Gut health focus**\nGoal: calm intestinal inflammation, reduce SIBO-related overgrowth, and improve digestion and absorption of macro- and micronutrients.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Nutrition**: Follow the Hashimoto\'s-adapted anti-inflammatory diet outlined in your PDF.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Re-check at the end of Week 4**: repeat ALT, AST, bilirubin, Free T3, Free T4, and a lipid panel.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Next step after 4 weeks**: adjust the treatment plan based on new labs and symptoms, then add modules for systemic anti-inflammation, lymphatic support, stress regulation, immune balancing, and further antibody reduction.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Would you like me to e-prescribe Ursodiol to your pharmacy and issue lab orders for ferritin, iron + TIBC, vitamin D (25-OH), and vitamin B12?'
        },
        {
            type: 'message',
            sender: 'user',
            text: 'yes pls'
        },
        {
            type: 'message',
            sender: 'bot',
            text: 'Do you have any questions about the plan?'
        },
        { type: 'message', sender: 'user', text: 'when do you think i might start feeling better?' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Most patients notice more energy and less bloating within **about two weeks** if they follow the plan closely.'
        },
        { type: 'message', sender: 'user', text: 'why did you include treating the gut if my problem is with the thyroid? is it because of my symptoms?' },
        {
            type: 'message',
            sender: 'bot',
            text: 'Constipation and bloating are signs that the gut isn’t functioning optimally. About 70% of the immune system is formed and regulated in the gut. In Hashimoto’s, our goal is to calm and rebalance immune activity. If the gut is inflamed, leaky, or the microbiome is disrupted, it can drive systemic inflammation and keep the autoimmune process active. That’s why gut repair isn’t just about symptom relief — it’s a foundation for lowering antibodies and supporting long-term healing.'
        },
    ];

    const conversationFlow2 = [
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
        { type: 'message', sender: 'user', text: 'oh right i totally forgot!' },
        {
            type: 'message',
            sender: 'bot',
            text: 'No worries! Quick reminder—a healthy gut helps keep inflammation down, which is key for managing your autoimmune condition. How about adding some sauerkraut on the side? You mentioned yesterday that you have it at home.'
        },
    ];

    const conversationFlow3 = [
        {
            type: 'message',
            sender: 'bot',
            text: 'Hey again—it\'s been four weeks! At the start, you had fatigue, hair loss, constipation, dry skin, bloating, and irritability. How are you feeling now?'
        },
        { type: 'message', sender: 'user', text: 'way more energy, no afternoon naps! bowels regular, no bloating. skin is smoother. less irritable too.' },
        {
            type: 'message',
            sender: 'bot',
            text: 'That\'s excellent progress 🎉 I\'ve also reviewed your follow-up labs:\n\n• **ALT & AST** have returned to normal, confirming the liver protocol is working.\n• **Triglycerides** are now in the normal range, and **total cholesterol** has improved—still a bit above target, but trending in the right direction.\n• **Free T3** is climbing, which means T4→T3 conversion is improving.\n\nLowering thyroid antibodies will take longer, but your symptom relief and lab gains show we\'re on track.'
        },
        {
            type: 'message',
            sender: 'bot',
            text: '**Next step**: keep the gut program going and add targeted immune-modulation support. We\'ll reassess antibodies, cholesterol, and overall progress at the eight-week mark and adjust supplements if needed.'
        },
    ];

    const allConversations = [conversationFlow1, conversationFlow2, conversationFlow3];
    let currentConversationIndex = 0; // Default to the first scenario (index 0)
    let activeConversation = allConversations[currentConversationIndex]; // Initialize with the first conversation
    let currentItemIndex = 0;
    let currentTimeoutId = null;
    // New state variables for the next item trigger listener
    let armNextItemTriggerListener = null; // Stores the function instance for adding/removing
    let armedListenerTarget = null;        // Stores the target element/window for the listener
    let armedListenerType = null;          // Stores the type of event (e.g., 'keydown', 'click')
    let initialInputHeight = ''; // To store initial height
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
        const MISTYPE_PROBABILITY = 0.04; // 4% chance to mistype an alphanumeric character
        const TYPING_CHAR_DELAY_MS_BASE = TYPING_CHAR_DELAY_MS; // Use the global base
        const TYPING_CHAR_DELAY_VARIATION = 12; // +/- 6ms, so can range from (base-6) to (base+6)
        const MISTYPE_DISPLAY_DELAY_MS = 150;   // How long the "mistake" shows
        const BACKSPACE_DELAY_MS = 100;         // Speed of backspace
        const PRE_CORRECTION_DELAY_MS = 70;    // Pause after backspace, before correct char

        const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
        const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const DIGIT_CHARS = "0123456789";

        function getRandomChar(charSet) {
            return charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        if (userInput) {
            userInput.readOnly = false; // Make it writable for simulation
            userInput.focus(); 
            userInput.value = ''; // Ensure it's empty before setting height

            // Set to the known single-line height on an empty textarea first
            userInput.style.height = 'auto'; // Reset to auto to allow collapse to content (empty)
            void userInput.offsetHeight;      // Force reflow
            userInput.style.height = initialInputHeight; 
            void userInput.offsetHeight; // Force reflow to apply this starting height

            for (let i = 0; i < messageText.length; i++) {
                const correctChar = messageText[i];
                let currentWords = userInput.value.split(' ');
                let currentWord = currentWords[currentWords.length -1];
                
                let charBaseDelay = TYPING_CHAR_DELAY_MS_BASE;
                // Slightly vary base delay for a more natural rhythm
                if (correctChar === ' ' || ['.', ',', '?', '!'].includes(correctChar)) {
                    charBaseDelay += 20; // Add a bit more delay for punctuation/spaces
                } else if (currentWord.length % 7 === 0 && currentWord.length > 0 && Math.random() < 0.3) {
                    // Occasional longer pause mid-word as if thinking or adjusting
                    charBaseDelay += 50;
                }

                let actualCharDelay = charBaseDelay + (Math.random() * TYPING_CHAR_DELAY_VARIATION - (TYPING_CHAR_DELAY_VARIATION / 2));
                if (actualCharDelay < 5) actualCharDelay = 5; // Ensure a minimum delay

                let performMistake = Math.random() < MISTYPE_PROBABILITY;
                let charToMistypeWith = '';

                if (performMistake) {
                    if (LOWERCASE_CHARS.includes(correctChar)) {
                        do { charToMistypeWith = getRandomChar(LOWERCASE_CHARS); } while (charToMistypeWith === correctChar);
                    } else if (UPPERCASE_CHARS.includes(correctChar)) {
                        do { charToMistypeWith = getRandomChar(UPPERCASE_CHARS); } while (charToMistypeWith === correctChar);
                    } else if (DIGIT_CHARS.includes(correctChar)) {
                        do { charToMistypeWith = getRandomChar(DIGIT_CHARS); } while (charToMistypeWith === correctChar);
                    } else {
                        performMistake = false; // Don't mistype special characters, spaces, or newlines for simplicity
                    }
                }

                if (performMistake) {
                    userInput.value += charToMistypeWith;
                    userInput.scrollLeft = userInput.scrollWidth;
                    await new Promise(resolve => setTimeout(resolve, MISTYPE_DISPLAY_DELAY_MS));

                    userInput.value = userInput.value.slice(0, -1); // Simulate backspace
                    userInput.scrollLeft = userInput.scrollWidth;
                    await new Promise(resolve => setTimeout(resolve, BACKSPACE_DELAY_MS));
                    
                    await new Promise(resolve => setTimeout(resolve, PRE_CORRECTION_DELAY_MS));
                }

                // Type the correct character
                userInput.value += correctChar;
                
                const currentScrollTop = userInput.scrollTop; 
                userInput.style.height = initialInputHeight; // Assume single line is enough initially
                void userInput.offsetHeight; // Apply this height and let browser calculate scroll/client height

                // If content (scrollHeight) is now greater than the visible area (clientHeight at single-line height)
                if (userInput.scrollHeight > userInput.clientHeight) {
                    // Then allow it to grow to the full scrollHeight
                    userInput.style.height = 'auto';
                    void userInput.offsetHeight;
                    userInput.style.height = (userInput.scrollHeight + 2) + 'px'; 
                }
                // If not, it stays at initialInputHeight (single line)
                
                userInput.scrollTop = currentScrollTop; 

                chatMessages.scrollTop = chatMessages.scrollHeight; 

                await new Promise(resolve => setTimeout(resolve, actualCharDelay));
            }
        }
        userInput.readOnly = true; // Make it readonly again
        if(initialInputHeight) {
            userInput.style.height = initialInputHeight;
            userInput.style.overflowY = 'hidden'; // Reset overflow as well
        } else { 
            // Fallback if initialInputHeight wasn't captured (should be extremely rare)
            const computedStyle = window.getComputedStyle(userInput);
            userInput.style.height = computedStyle.minHeight; 
        }
    }
    
    async function processUserTurnAutomated(userMessageItem) {
        if (userInput) {
            await simulateUserTypingIntoInput(userMessageItem.text);
            displayChatMessage(userMessageItem.text, 'user');
            userInput.value = ''; 
            userInput.blur(); 

            // Correct place for resetting height and readonly state
            userInput.readOnly = true; 
            if(initialInputHeight) {
                userInput.style.height = initialInputHeight;
                userInput.style.overflowY = 'hidden'; 
            } else { 
                const computedStyle = window.getComputedStyle(userInput);
                userInput.style.height = computedStyle.minHeight; 
            }
        }
        currentItemIndex++;
        showNextItem(); 
    }

    // New helper function to clean up the active next item trigger listener
    function cleanupNextItemTriggerListener() {
        if (armNextItemTriggerListener && armedListenerTarget && armedListenerType) {
            armedListenerTarget.removeEventListener(armedListenerType, armNextItemTriggerListener);
        }
        armNextItemTriggerListener = null;
        armedListenerTarget = null;
        armedListenerType = null;
    }

    function showNextItem() {
        if (currentTimeoutId) { 
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        cleanupNextItemTriggerListener(); // Always cleanup previous listener first

        if (currentItemIndex >= activeConversation.length) {
            return;
        }

        const currentItem = activeConversation[currentItemIndex];

        // Conditions for automatic display (no trigger needed)
        // System messages, user-uploaded images, and user-uploaded files are displayed automatically.
        // The very first message of a scenario is handled by switchConversation or initial load.
        if (currentItem.type === 'system' ||
            (currentItem.type === 'image' && currentItem.sender === 'user') ||
            (currentItem.type === 'file' && currentItem.sender === 'user')) {
            displayItem(currentItem);
            currentItemIndex++;
            // Use a minimal delay to ensure display completes before next step in the queue.
            currentTimeoutId = setTimeout(() => showNextItem(), MINIMAL_SEQUENTIAL_DELAY_MS); 
            return;
        }

        // For all other types (user messages/files/images, bot messages/files/images), we wait for a trigger.
        let preparationDelayMs = MINIMAL_SEQUENTIAL_DELAY_MS;
        if (currentItem.sender === 'bot') { // Any bot item (message, file, image)
             preparationDelayMs = BOT_FIXED_RESPONSE_MS;
        }
        // For user text messages, preparation delay is minimal before arming. 
        // DELAY_AFTER_SPACE_PRESS_MS applies *after* the trigger.

        currentTimeoutId = setTimeout(() => {
            const handleTrigger = (event) => {
                let proceed = false;
                const isMobileView = window.innerWidth <= 600;

                // Check for desktop trigger (Space key)
                if (!isMobileView && event.type === 'keydown' && (event.key === ' ' || event.code === 'Space')) {
                    event.preventDefault();
                    proceed = true;
                } 
                // Check for mobile trigger (click)
                else if (isMobileView && event.type === 'click') {
                    // If the listener is on chatMessages, any click inside is a trigger.
                    // Add event.preventDefault() if the click target might have default actions we want to stop.
                    proceed = true;
                }

                if (proceed) {
                    cleanupNextItemTriggerListener(); // Remove this listener once triggered
                    
                    if (userInput) userInput.readOnly = true; // Ensure readonly before next action

                    // Action after trigger is pressed
                    if (currentItem.type === 'message' && currentItem.sender === 'user') {
                        // User's text message: simulate typing then display
                        setTimeout(() => {
                            processUserTurnAutomated(currentItem); 
                            // processUserTurnAutomated calls showNextItem()
                        }, DELAY_AFTER_SPACE_PRESS_MS); 
                    } else {
                        // Bot messages (any type), User files (from bot), User images (from bot): display immediately
                        displayItem(currentItem);
                        currentItemIndex++;
                        showNextItem(); // Then prepare the next item in the sequence
                    }
                }
            };
            
            armNextItemTriggerListener = handleTrigger; // Store the function instance

            const isMobileViewForListener = window.innerWidth <= 600;
            if (isMobileViewForListener) {
                armedListenerTarget = chatMessages; // Target the chat messages area for taps
                armedListenerType = 'click';
            } else { // Desktop
                armedListenerTarget = window;
                armedListenerType = 'keydown';
            }
            
            if (armedListenerTarget && armedListenerType && armNextItemTriggerListener) {
                armedListenerTarget.addEventListener(armedListenerType, armNextItemTriggerListener);
            }
        }, preparationDelayMs);
    }

    function switchConversation(flow, entryAnimationClass = null) {
        if (currentTimeoutId) {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = null;
        }
        cleanupNextItemTriggerListener(); // Use the new cleanup function

        chatMessages.innerHTML = ''; 
        activeConversation = flow;
        currentConversationIndex = allConversations.indexOf(flow); // Update the current index
        currentItemIndex = 0;

        if (userInput) {
            userInput.value = ''; // Clear input on switch
            userInput.readOnly = true; // Ensure readonly on switch
            if (initialInputHeight) { // Reset height
                 userInput.style.height = initialInputHeight;
            } else {
                const computedStyle = window.getComputedStyle(userInput);
                userInput.style.height = computedStyle.minHeight;
            }
        }
        
        if (activeConversation.length > 0) {
            if (chatMessages && entryAnimationClass) {
                chatMessages.classList.add(entryAnimationClass);
                chatMessages.addEventListener('animationend', function handleSlideInAnimationEnd() {
                    chatMessages.classList.remove(entryAnimationClass);
                    chatMessages.removeEventListener('animationend', handleSlideInAnimationEnd);
                }, { once: true });
            }
            displayItem(activeConversation[0]); // Display the first item immediately
            currentItemIndex = 1; // Advance index to prepare for the next item
        }
        showNextItem();
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === '1') {
            switchConversation(conversationFlow1); 
        } else if (event.key === '2') {
            switchConversation(conversationFlow2); 
        } else if (event.key === '3') {
            switchConversation(conversationFlow3); 
        } else if (window.innerWidth > 600) { // Desktop mode for arrow keys
            let newIndex = -1;
            if (event.key === 'ArrowRight') {
                newIndex = (currentConversationIndex + 1) % allConversations.length;
            } else if (event.key === 'ArrowLeft') {
                newIndex = (currentConversationIndex - 1 + allConversations.length) % allConversations.length;
            }

            if (newIndex !== -1 && newIndex !== currentConversationIndex) {
                switchConversation(allConversations[newIndex]);
            }
        }
    });

    // Initial start
    if (activeConversation.length > 0) {
        displayItem(activeConversation[0]); // Display the first item of the default conversation immediately
        currentItemIndex = 1; // Advance index
    }
    if (userInput && !initialInputHeight) { // Capture initial height once after styles are applied
        initialInputHeight = window.getComputedStyle(userInput).height; // Use .height as it's now explicitly set
    }
    if (userInput) userInput.readOnly = true; // Initial state readonly
    showNextItem(); // Prepare the next item in the sequence

    // Swipe detection logic
    const SWIPE_THRESHOLD_X = 50; // Min horizontal distance for a swipe
    const SWIPE_VERTICAL_TOLERANCE = 70; // Max vertical distance allowed during a horizontal swipe

    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(event) {
        if (window.innerWidth > 600) return; // Only on "mobile"
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }

    function handleTouchEnd(event) {
        if (window.innerWidth > 600) return; // Only on "mobile"

        const touchEndX = event.changedTouches[0].screenX;
        const touchEndY = event.changedTouches[0].screenY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD_X && Math.abs(deltaY) < SWIPE_VERTICAL_TOLERANCE) {
            if (event.cancelable) {
                 event.preventDefault();
            }

            let newIndex;
            let slideOutClass = '';
            let slideInClassForNew = '';

            if (deltaX < 0) { // Swipe Left (finger moves left, old content slides out left)
                newIndex = (currentConversationIndex + 1) % allConversations.length;
                slideOutClass = 'chat-messages-slide-out-left';
                slideInClassForNew = 'chat-messages-slide-in-from-right';
            } else { // Swipe Right (finger moves right, old content slides out right)
                newIndex = (currentConversationIndex - 1 + allConversations.length) % allConversations.length;
                slideOutClass = 'chat-messages-slide-out-right';
                slideInClassForNew = 'chat-messages-slide-in-from-left';
            }

            if (newIndex !== currentConversationIndex) {
                if (chatMessages && slideOutClass) {
                    chatMessages.classList.add(slideOutClass);
                    chatMessages.addEventListener('animationend', function handleSlideOutAnimationEnd() {
                        chatMessages.classList.remove(slideOutClass);
                        chatMessages.removeEventListener('animationend', handleSlideOutAnimationEnd);
                        // Now actually switch the conversation and pass the class for the new content to slide in
                        switchConversation(allConversations[newIndex], slideInClassForNew);
                    }, { once: true });
                } else {
                    // Fallback if no animation, directly switch
                    switchConversation(allConversations[newIndex]);
                }
            }
        }
        touchStartX = 0;
        touchStartY = 0;
    }

    // Attach swipe listeners to the document or a main container.
    // Using document here for simplicity, can be scoped to chatContainer if preferred.
    // Consider passive: false if preventDefault is critical and needs to work reliably.
    // For now, passive: true on touchstart is okay as preventDefault is conditional in touchend.
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, false);
}); 