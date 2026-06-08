
"use strict";

const logger = require("./logger");

/**
 * Perform a calculation.
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @param {"add"|"sub"|"mul"|"div"} op - Operation
 * @param {string|null} [requestId] - Optional request correlation ID
 * @returns {number|string|null} Result of the calculation, "NO" on divide-by-zero, or null on unknown op
 */
function calc(a, b, op, requestId = null) {
    logger.info("calc_start", { a, b, op }, requestId);

    if (op === "add") {
        const result = a + b;
        logger.info("calc_success", { result, op }, requestId);
        return result;
    } else if (op === "sub") {
        const result = a - b;
        logger.info("calc_success", { result, op }, requestId);
        return result;
    } else if (op === "mul") {
        const result = a * b;
        logger.info("calc_success", { result, op }, requestId);
        return result;
    } else if (op === "div") {
        if (b === 0) {
            logger.warn("divide_by_zero", { a, b }, requestId);
            return "NO";
        }
        const result = a / b;
        logger.info("calc_success", { result, op }, requestId);
        return result;
    } else {
        logger.warn("unknown_operation", { op }, requestId);
        return null;
    }
}

/**
 * Process user input safely and perform calculation.
 * @param {{ n1: string|number, n2: string|number, operation: string, requestId?: string, headers?: Record<string,string> }} req
 * @returns {{ r: number|string|null }}
 */
function processUserInput(req) {
    const requestId =
        (req && (req.requestId || req.id)) ||
        (req && req.headers && (req.headers["x-request-id"] || req.headers["X-Request-Id"])) ||
        null;

    const num1 = parseFloat(req.n1);
    const num2 = parseFloat(req.n2);
    const op = req.operation;

    logger.info("user_input_received", { hasN1: "n1" in req, hasN2: "n2" in req, op }, requestId);

    const r = calc(num1, num2, op, requestId);

    logger.info("user_input_processed", { result: r, op }, requestId);
    return { r };
}

module.exports = { calc, processUserInput };
