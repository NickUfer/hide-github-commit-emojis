// ==UserScript==
// @name         Hide Github Commit Emojis
// @namespace    https://github.com/NickUfer/hide-github-commit-emojis
// @version      0.1.0
// @description  Hides all emojis from github commit messages
// @author       Nick Ufer
// @homepage     https://github.com/NickUfer/hide-github-commit-emojis
// @homepageURL  https://github.com/NickUfer/hide-github-commit-emojis
// @source       https://github.com/NickUfer/hide-github-commit-emojis
// @supportURL   https://github.com/NickUfer/hide-github-commit-emojis/issues
// @match        https://github.com/*
// @updateURL    https://github.com/NickUfer/hide-github-commit-emojis/raw/main/hide-github-commit-emojis.user.js
// @downloadURL  https://github.com/NickUfer/hide-github-commit-emojis/raw/main/hide-github-commit-emojis.user.js
// @copyright    MIT License
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{2934}\u{2935}\u{2B06}\u{2B07}\u{2B05}\u{27A1}\u{2194}-\u{2199}\u{21A9}\u{21AA}]/gu;

    /**
     * @param textNode {Text}
     */
    function removeEmojisFromTextNode(textNode) {
        if (textNode.parentNode.nodeType !== Node.ELEMENT_NODE) return;
        if (textNode.parentNode.nodeName !== 'A') return;
        if (!textNode.parentNode.classList.contains('Link--secondary')) return;

        observer.disconnect();

        const replacedText = textNode.textContent.replace(emojiRegex, '');
        textNode.parentNode.title = replacedText
        textNode.textContent = replacedText;

        attachObserver();
    }

    /**
     * @param node {Node}
     */
    function removeEmojisFromNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            removeEmojisFromTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(removeEmojisFromNode);
        }
    }

    /**
     * @param mutationRecord {MutationRecord}
     */
    function processMutation(mutationRecord) {
        if (mutationRecord.type === 'childList') {
            mutationRecord.addedNodes.forEach(node => removeEmojisFromNode(node));
        } else if (mutationRecord.type === 'characterData') {
            removeEmojisFromNode(mutationRecord.target)
        }
    }

    /**
     * @param mutationRecordList {MutationRecord[]}
     */
    function observeMutations(mutationRecordList) {
        mutationRecordList.forEach(processMutation);
    }

    const observer = new MutationObserver(observeMutations);

    function attachObserver() {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    }

    // Initial pass to remove emojis from the current document
    removeEmojisFromNode(document.body);

    attachObserver();
})();
