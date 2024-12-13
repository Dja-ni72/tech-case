const questionService = require("../services/question-service");

/**
 * List questions from a course
 */
const list = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const questions = await questionService.getAllByCourse(courseId);
    res.status(200).json(questions);
  } catch (err) {
    return next(err);
  }
};

/**
 * Get a specific question
 */
const get = async (req, res, next) => {
  try {
    const question = await questionService.getById(req.params.questionId);

    res.status(200).json(question);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create a question
 */
const create = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const question = await questionService.create(courseId, req.body);

    res.status(201).json(question);
  } catch (err) {
    return next(err);
  }
};

/**
 * Update a question
 */
const update = async (req, res, next) => {
  try {
    const question = await questionService.update(
      req.params.questionId,
      req.body
    );

    res.status(200).json(question);
  } catch (err) {
    return next(err);
  }
};

/**
 * Remove a question
 */
const remove = async (req, res, next) => {
  try {
    await questionService.remove(req.params.courseId, req.params.questionId);

    res.status(204).json();
  } catch (err) {
    return next(err);
  }
};

/**
 * Duplicate a question
 */
const duplicate = async (req, res, next) => {
  try {
    const { courseId, questionId } = req.params;
    const question = await questionService.getById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    // Exclude the `_id` field and duplicate the question
    const { _id, ...questionData } = question.toObject();
    const duplicatedQuestion = await questionService.create(courseId, {
      ...questionData,
      title: `${question.title} (Copy)`,
    });
    res.status(201).json(duplicatedQuestion);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  duplicate,
};
