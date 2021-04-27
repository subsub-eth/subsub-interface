import BN from 'bn.js';
import {
} from '../../types/truffle-contracts';

import eb from '../helper';

const SubscriptionContainer = artifacts.require("SubscriptionContainer");
const equalsBn = eb(assert.ok);

// Actually uses SubscriptionContainer as SubscriptionList is a Library
contract("SubscriptionList", async accounts => {

  it("should be an empty sub list at the beginning", async () => {
    const list = await SubscriptionContainer.new();
    const head = await list.head();
    const subs = await list.activeSubscriptions();
    assert.notOk(head[0]);
    equalsBn(head[1], 0);
    equalsBn(head[2], 0);
    equalsBn(subs, 0);

    try {
      await list.next(head[1]);
    } catch (error) {
      // this is fine
      return;
    }
    assert.fail("not allowed to call next on empty list")
  });

  it("should append to a new list and return the value as the head", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(2, 2);
    const head = await list.head();
    const subs = await list.activeSubscriptions();
    assert.ok(head[0]);
    equalsBn(head[1], 2);
    equalsBn(head[2], 2);
    equalsBn(subs, 2);

    const next = await list.next(head[1]);
    assert.notOk(next[0]);
    equalsBn(next[1], 0);
    equalsBn(next[2], 0);
  });

  it("should append another value to the list", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    await list.append(5, 2);

    const subs = await list.activeSubscriptions();
    equalsBn(subs, 3);

    const head = await list.head();
    assert.ok(head[0]);
    equalsBn(head[1], 4);
    equalsBn(head[2], 1);

    const next = await list.next(head[1]);
    assert.ok(next[0]);
    equalsBn(next[1], 5);
    equalsBn(next[2], 2);

  });

  it("should throw an error in case append at the same position", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    try {
      await list.append(4, 20);
    } catch (error) {
      // this is fine
      return;
    }
    assert.fail("appending should fail");
  });

  it("should throw an error in case append at not tail position", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    try {
      await list.append(2, 1);
    } catch (error) {
      // this is fine
      return
    }
    assert.fail("appending should fail");
  });

  it("should remove an entry", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    await list.append(5, 2);

    await list.remove(4, 1);

    const head = await list.head();
    assert.ok(head[0]);
    equalsBn(head[1], 5);
    equalsBn(head[2], 2);

    const subs = await list.activeSubscriptions();
    equalsBn(subs, 2);
  });

  it("should reduce an entry", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 5);
    await list.append(5, 2);

    await list.remove(4, 2);

    const head = await list.head();
    assert.ok(head[0]);
    equalsBn(head[1], 4);
    equalsBn(head[2], 3);

    const subs = await list.activeSubscriptions();
    equalsBn(subs, 5);
  });


  it("should insert another entry at the head", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    await list.insertBefore(4, 3, 2);

    const subs = await list.activeSubscriptions();
    equalsBn(subs, 3);

    const head = await list.head();
    assert.ok(head[0]);
    equalsBn(head[1], 3);
    equalsBn(head[2], 2);

    const next = await list.next(head[1]);
    assert.ok(next[0]);
    equalsBn(next[1], 4);
    equalsBn(next[2], 1);
  });

  it("should add to an existing position", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);
    await list.add(4, 2);

    const subs = await list.activeSubscriptions();
    equalsBn(subs, 3);

    const head = await list.head();
    assert.ok(head[0]);
    equalsBn(head[1], 4);
    equalsBn(head[2], 3);
  });

  it("should fail to add to an non-existing position", async () => {
    const list = await SubscriptionContainer.new();
    await list.append(4, 1);

    try {
      await list.add(2, 2);
    } catch (error) {

      const subs = await list.activeSubscriptions();
      equalsBn(subs, 1);

      const head = await list.head();
      assert.ok(head[0]);
      equalsBn(head[1], 4);
      equalsBn(head[2], 1);

      return;
    }
    assert.fail("Adding to a non-exiting position did not cause an exception");

  });
})
